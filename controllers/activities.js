const Activity = require('../schemas/activity');
const Itinerary = require('../schemas/itinerary');

module.exports = {
    // Lấy tất cả hoạt động
    GetAllActivities: async function() {
        return await Activity.find().populate('itinerary_id');
    },
    
    // Lấy chi tiết một hoạt động
    GetActivityById: async function(id) {
        const activity = await Activity.findById(id).populate('itinerary_id');
        if (!activity) {
            throw new Error('Hoạt động không tồn tại');
        }
        return activity;
    },
    
    // Tạo hoạt động mới
    CreateActivity: async function(activityData) {
        // Kiểm tra lịch trình có tồn tại không
        const itinerary = await Itinerary.findById(activityData.itinerary_id);
        if (!itinerary) {
            throw new Error('Lịch trình không tồn tại');
        }
        
        const newActivity = new Activity({
            activity_name: activityData.activity_name,
            start_time: activityData.start_time,
            end_time: activityData.end_time,
            itinerary_id: activityData.itinerary_id
        });
        
        await newActivity.save();
        
        // Cập nhật mảng activities trong itinerary
        itinerary.activities.push(newActivity._id);
        await itinerary.save();
        
        return newActivity;
    },
    
    // Cập nhật hoạt động
    UpdateActivity: async function(id, activityData) {
        const activity = await Activity.findById(id);
        if (!activity) {
            throw new Error('Hoạt động không tồn tại');
        }
        
        if (activityData.activity_name) activity.activity_name = activityData.activity_name;
        if (activityData.start_time) activity.start_time = activityData.start_time;
        if (activityData.end_time) activity.end_time = activityData.end_time;
        
        // Nếu thay đổi lịch trình
        if (activityData.itinerary_id && activityData.itinerary_id !== activity.itinerary_id.toString()) {
            // Xóa hoạt động khỏi lịch trình cũ
            await Itinerary.findByIdAndUpdate(
                activity.itinerary_id,
                { $pull: { activities: id } }
            );
            
            // Thêm hoạt động vào lịch trình mới
            await Itinerary.findByIdAndUpdate(
                activityData.itinerary_id,
                { $push: { activities: id } }
            );
            
            activity.itinerary_id = activityData.itinerary_id;
        }
        
        await activity.save();
        return activity;
    },
    
    // Xóa hoạt động
    DeleteActivity: async function(id) {
        const activity = await Activity.findById(id);
        if (!activity) {
            throw new Error('Hoạt động không tồn tại');
        }
        
        // Xóa hoạt động khỏi lịch trình
        await Itinerary.findByIdAndUpdate(
            activity.itinerary_id,
            { $pull: { activities: id } }
        );
        
        await Activity.findByIdAndDelete(id);
        return { message: 'Xóa hoạt động thành công' };
    },
    
    // Lấy hoạt động theo lịch trình
    GetActivitiesByItinerary: async function(itineraryId) {
        return await Activity.find({ itinerary_id: itineraryId }).populate('itinerary_id');
    }
};