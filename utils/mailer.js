const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "add7a05e315873",
        pass: "b96000fa2f36f7",
    },
});

module.exports = {
    sendmailFrogetPass: async function (to, URL) {
        return await transporter.sendMail({
            from: `DPT Travel <noreply@dpttravel.com>`, // sender address
            to: to, // list of receivers
            subject: "Đặt lại mật khẩu - DPT Travel", // Subject line
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #4a89dc;">Đặt lại mật khẩu</h2>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào liên kết dưới đây để tiếp tục:</p>
                <p style="margin: 20px 0;">
                    <a href="${URL}" style="background-color: #4a89dc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Đặt lại mật khẩu</a>
                </p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <p>Liên kết này sẽ hết hạn sau 10 phút.</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} DPT Travel. Tất cả các quyền được bảo lưu.</p>
            </div>`,
            headers: {
                "Content-Type": "text/html; charset=UTF-8"
            }
        });
    },
    
    sendVerificationCode: async function (to, code) {
        return await transporter.sendMail({
            from: `DPT Travel <noreply@dpttravel.com>`, // sender address
            to: to, // list of receivers
            subject: "Mã xác minh - DPT Travel", // Subject line
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #4a89dc;">Mã xác minh của bạn</h2>
                <p>Bạn đã yêu cầu mã xác minh để đặt lại mật khẩu. Vui lòng sử dụng mã dưới đây:</p>
                <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
                    ${code}
                </div>
                <p>Mã này sẽ hết hạn sau 10 phút.</p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} DPT Travel. Tất cả các quyền được bảo lưu.</p>
            </div>`,
            headers: {
                "Content-Type": "text/html; charset=UTF-8"
            }
        });
    },
    
    sendBookingConfirmation: async function (to, bookingDetails) {
        return await transporter.sendMail({
            from: `DPT Travel <noreply@dpttravel.com>`, // sender address
            to: to, // list of receivers
            subject: "Xác nhận đặt tour - DPT Travel", // Subject line
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #4a89dc;">Xác nhận đặt tour</h2>
                <p>Cảm ơn bạn đã đặt tour với DPT Travel. Dưới đây là chi tiết đơn đặt tour của bạn:</p>
                
                <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p><strong>Mã đơn hàng:</strong> ${bookingDetails.id}</p>
                    <p><strong>Tour:</strong> ${bookingDetails.destinationName}</p>
                    <p><strong>Ngày đặt:</strong> ${new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
                    <p><strong>Số vé người lớn:</strong> ${bookingDetails.adultTickets}</p>
                    <p><strong>Số vé trẻ em:</strong> ${bookingDetails.childTickets}</p>
                    <p><strong>Tổng số ngày:</strong> ${bookingDetails.days}</p>
                    <p><strong>Tổng tiền:</strong> ${bookingDetails.totalAmount.toLocaleString()} VND</p>
                    <p><strong>Trạng thái:</strong> ${bookingDetails.status}</p>
                </div>
                
                <p>Nhân viên của chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn đặt tour.</p>
                <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email support@dpttravel.com hoặc số điện thoại 1900-1234.</p>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} DPT Travel. Tất cả các quyền được bảo lưu.</p>
            </div>`,
            headers: {
                "Content-Type": "text/html; charset=UTF-8"
            }
        });
    },
    
    sendPaymentConfirmation: async function (to, paymentDetails) {
        return await transporter.sendMail({
            from: `DPT Travel <noreply@dpttravel.com>`, // sender address
            to: to, // list of receivers
            subject: "Xác nhận thanh toán - DPT Travel", // Subject line
            html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #4a89dc;">Xác nhận thanh toán</h2>
                <p>Cảm ơn bạn đã thanh toán cho đơn đặt tour. Dưới đây là chi tiết thanh toán của bạn:</p>
                
                <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p><strong>Mã hóa đơn:</strong> ${paymentDetails.invoiceCode}</p>
                    <p><strong>Mã đơn hàng:</strong> ${paymentDetails.bookingId}</p>
                    <p><strong>Ngày thanh toán:</strong> ${new Date(paymentDetails.paymentDate).toLocaleDateString()}</p>
                    <p><strong>Số tiền:</strong> ${paymentDetails.amount.toLocaleString()} VND</p>
                    <p><strong>Phương thức thanh toán:</strong> ${paymentDetails.paymentMethod}</p>
                    <p><strong>Trạng thái:</strong> ${paymentDetails.status}</p>
                </div>
                
                <p>Đơn đặt tour của bạn đã được xác nhận. Chúng tôi sẽ gửi thêm thông tin chi tiết về tour trước ngày khởi hành.</p>
                <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email support@dpttravel.com hoặc số điện thoại 1900-1234.</p>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} DPT Travel. Tất cả các quyền được bảo lưu.</p>
            </div>`,
            headers: {
                "Content-Type": "text/html; charset=UTF-8"
            }
        });
    }
};
