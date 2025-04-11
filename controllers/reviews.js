const Review = require('../schemas/reviews');
const User = require('../schemas/user');
const Destination = require('../schemas/destinations');
const Booking = require('../schemas/Bookings');

module.exports = {
    // Lấy tất cả đánh giá
    GetAllReviews: async function() {
        return await Review.find()
            .populate('user_id')
            .populate('destination_id');
    },
    
    // Lấy chi tiết một đánh giá
    GetReviewById: async function(id) {
        const review = await Review.findById(id)
            .populate('user_id')
            .populate('destination_id');
            
        if (!review) {
            throw new Error('Đánh giá không tồn tại');
        }
        
        return review;
    },
    
    // Tạo đánh giá mới
    CreateReview: async function(reviewData) {
        // Kiểm tra người dùng có tồn tại không
        const user = await User.findById(reviewData.user_id);
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }
        
        // Kiểm tra điểm đến có tồn tại không
        const destination = await Destination.findById(reviewData.destination_id);
        if (!destination) {
            throw new Error('Điểm đến không tồn tại');
        }
        
        // Kiểm tra người dùng đã đặt tour này chưa
        const hasBooking = await Booking.findOne({
            user_id: reviewData.user_id,
            destination_id: reviewData.destination_id,
            status: 'paid'
        });
        
        if (!hasBooking) {
            throw new Error('Bạn cần đặt và thanh toán tour này trước khi đánh giá');
        }
        
        const newReview = new Review({
            comment: reviewData.comment,
            rating: reviewData.rating,
            destination_id: reviewData.destination_id,
            user_id: reviewData.user_id
        });
        
        await newReview.save();
        
        // Cập nhật mảng reviews trong user
        user.reviews.push(newReview._id);
        await user.save();
        
        return newReview;
    },
    
    // Cập nhật đánh giá
    UpdateReview: async function(id, reviewData, userId) {
        const review = await Review.findById(id);
        if (!review) {
            throw new Error('Đánh giá không tồn tại');
        }
        
        // Kiểm tra xem người dùng có phải là người tạo đánh giá không
        if (review.user_id.toString() !== userId) {
            throw new Error('Bạn không có quyền cập nhật đánh giá này');
        }
        
        if (reviewData.comment) review.comment = reviewData.comment;
        if (reviewData.rating) review.rating = reviewData.rating;
        
        await review.save();
        return review;
    },
    
    // Xóa đánh giá
    DeleteReview: async function(id, userId, isAdmin = false) {
        const review = await Review.findById(id);
        if (!review) {
            throw new Error('Đánh giá không tồn tại');
        }
        
        // Kiểm tra xem người dùng có phải là người tạo đánh giá hoặc admin không
        if (!isAdmin && review.user_id.toString() !== userId) {
            throw new Error('Bạn không có quyền xóa đánh giá này');
        }
        
        // Xóa đánh giá khỏi user
        await User.findByIdAndUpdate(
            review.user_id,
            { $pull: { reviews: id } }
        );
        
        await Review.findByIdAndDelete(id);
        return { message: 'Xóa đánh giá thành công' };
    },
    
    // Lấy đánh giá theo người dùng
    GetReviewsByUser: async function(userId) {
        return await Review.find({ user_id: userId })
            .populate('destination_id');
    },
    
    // Lấy đánh giá theo điểm đến
    GetReviewsByDestination: async function(destinationId) {
        return await Review.find({ destination_id: destinationId })
            .populate('user_id');
    }
};