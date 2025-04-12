const PaymentDetail = require('../schemas/paymentdetails');
const Booking = require('../schemas/Bookings');
const User = require('../schemas/user');

module.exports = {
  // Lấy tất cả chi tiết thanh toán
  GetAllPaymentDetails: async function () {
    return await PaymentDetail.find()
      .populate('booking_id')
      .populate('user_id');
  },

  // Lấy chi tiết một thanh toán
  GetPaymentDetailById: async function (id) {
    const paymentDetail = await PaymentDetail.findById(id)
      .populate('booking_id')
      .populate('user_id');

    if (!paymentDetail) {
      throw new Error('Chi tiết thanh toán không tồn tại');
    }

    return paymentDetail;
  },

 // Tạo chi tiết thanh toán mới
CreatePaymentDetail: async function(paymentData) {
    // Kiểm tra đơn đặt vé có tồn tại không
    const booking = await Booking.findById(paymentData.booking_id);
    if (!booking) {
      throw new Error('Đơn đặt vé không tồn tại');
    }
  
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(paymentData.user_id);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }
  
    // Kiểm tra payment_method có được cung cấp không
    if (!paymentData.payment_method) {
      throw new Error('Phương thức thanh toán không được để trống');
    }
  
    // Kiểm tra payment_method có hợp lệ không
    const validPaymentMethods = ['credit_card', 'bank_transfer', 'cash', 'momo', 'zalopay'];
    if (!validPaymentMethods.includes(paymentData.payment_method)) {
      throw new Error('Phương thức thanh toán không hợp lệ');
    }
  
    // Tạo mã hóa đơn
    const invoiceCode = 'INV-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  
    const newPaymentDetail = new PaymentDetail({
      amount: paymentData.amount,
      payment_date: paymentData.payment_date || new Date(),
      status: paymentData.status || 'pending',
      booking_id: paymentData.booking_id,
      payment_method: paymentData.payment_method,
      user_id: paymentData.user_id,
      invoice_code: invoiceCode
    });
  
    await newPaymentDetail.save();
  
    // Cập nhật payment_details trong booking
    booking.payment_details = newPaymentDetail._id;
    await booking.save();
  
    return newPaymentDetail;
  },

  // Cập nhật chi tiết thanh toán
  UpdatePaymentDetail: async function (id, paymentData) {
    const paymentDetail = await PaymentDetail.findById(id);
    if (!paymentDetail) {
      throw new Error('Chi tiết thanh toán không tồn tại');
    }

    if (paymentData.amount) paymentDetail.amount = paymentData.amount;
    if (paymentData.payment_date) paymentDetail.payment_date = paymentData.payment_date;
    if (paymentData.status) paymentDetail.status = paymentData.status;
    if (paymentData.payment_method_id) paymentDetail.payment_method_id = paymentData.payment_method_id;

    await paymentDetail.save();

    // Nếu thanh toán thành công, cập nhật trạng thái đơn đặt vé
    if (paymentData.status === 'completed') {
      await Booking.findByIdAndUpdate(
        paymentDetail.booking_id,
        { status: 'paid' }
      );
    }

    return paymentDetail;
  },

  // Xóa chi tiết thanh toán
  DeletePaymentDetail: async function (id) {
    const paymentDetail = await PaymentDetail.findById(id);
    if (!paymentDetail) {
      throw new Error('Chi tiết thanh toán không tồn tại');
    }

    // Xóa tham chiếu trong booking
    await Booking.findByIdAndUpdate(
      paymentDetail.booking_id,
      { $unset: { payment_details: 1 } }
    );

    await PaymentDetail.findByIdAndDelete(id);

    return { message: 'Xóa chi tiết thanh toán thành công' };
  },

  // Lấy chi tiết thanh toán theo người dùng
  GetPaymentDetailsByUser: async function (userId) {
    return await PaymentDetail.find({ user_id: userId })
      .populate('booking_id');
  },

  // Lấy chi tiết thanh toán theo trạng thái
  GetPaymentDetailsByStatus: async function (status) {
    return await PaymentDetail.find({ status })
      .populate('booking_id')
      .populate('user_id');
  }
};
