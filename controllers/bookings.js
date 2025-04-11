const Booking = require('../schemas/Bookings');
const User = require('../schemas/user');
const Destination = require('../schemas/destinations');
const PaymentDetail = require('../schemas/paymentdetails');

module.exports = {
    // Lấy tất cả đơn đặt vé
    GetAllBookings: async function() {
        return await Booking.find()
            .populate('user_id')
            .populate('destination_id')
            .populate('payment_details');
    },
    
    // Lấy chi tiết một đơn đặt vé
    GetBookingById: async function(id) {
        const booking = await Booking.findById(id)
            .populate('user_id')
            .populate('destination_id')
            .populate('payment_details');
            
        if (!booking) {
            throw new Error('Đơn đặt vé không tồn tại');
        }
        
        return booking;
    },
    
    // Tạo đơn đặt vé mới
    CreateBooking: async function(bookingData) {
        // Kiểm tra người dùng có tồn tại không
        const user = await User.findById(bookingData.user_id);
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }
        
        // Kiểm tra điểm đến có tồn tại không
        const destination = await Destination.findById(bookingData.destination_id);
        if (!destination) {
            throw new Error('Điểm đến không tồn tại');
        }
        
        const newBooking = new Booking({
            adult_tickets: bookingData.adult_tickets,
            child_tickets: bookingData.child_tickets,
            booking_date: bookingData.booking_date || new Date(),
            days: bookingData.days,
            status: bookingData.status || 'pending',
            destination_id: bookingData.destination_id,
            user_id: bookingData.user_id
        });
        
        await newBooking.save();
        
        // Cập nhật mảng bookings trong user
        user.bookings.push(newBooking._id);
        await user.save();
        
        return newBooking;
    },
    
    // Cập nhật đơn đặt vé
    UpdateBooking: async function(id, bookingData) {
        const booking = await Booking.findById(id);
        if (!booking) {
            throw new Error('Đơn đặt vé không tồn tại');
        }
        
        if (bookingData.adult_tickets) booking.adult_tickets = bookingData.adult_tickets;
        if (bookingData.child_tickets) booking.child_tickets = bookingData.child_tickets;
        if (bookingData.booking_date) booking.booking_date = bookingData.booking_date;
        if (bookingData.days) booking.days = bookingData.days;
        if (bookingData.status) booking.status = bookingData.status;
        
        await booking.save();
        return booking;
    },
    
    // Xóa đơn đặt vé
    DeleteBooking: async function(id) {
        const booking = await Booking.findById(id);
        if (!booking) {
            throw new Error('Đơn đặt vé không tồn tại');
        }
        
        // Xóa đơn đặt vé khỏi user
        await User.findByIdAndUpdate(
            booking.user_id,
            { $pull: { bookings: id } }
        );
        
        // Xóa chi tiết thanh toán liên quan
        if (booking.payment_details) {
            await PaymentDetail.findByIdAndDelete(booking.payment_details);
        }
        
        await Booking.findByIdAndDelete(id);
        return { message: 'Xóa đơn đặt vé thành công' };
    },
    
    // Lấy đơn đặt vé theo người dùng
    GetBookingsByUser: async function(userId) {
        return await Booking.find({ user_id: userId })
            .populate('destination_id')
            .populate('payment_details');
    },
    
    // Lấy đơn đặt vé theo trạng thái
    GetBookingsByStatus: async function(status) {
        return await Booking.find({ status })
            .populate('user_id')
            .populate('destination_id')
            .populate('payment_details');
    },
    
    // Cập nhật trạng thái đơn đặt vé
    UpdateBookingStatus: async function(id, status) {
      const booking = await Booking.findById(id);
      if (!booking) {
          throw new Error('Đơn đặt vé không tồn tại');
      }
      
      booking.status = status;
      await booking.save();
      return booking;
  }
};
