const Itinerary = require('../schemas/itinerary');
const Destination = require('../schemas/destinations');
const Activity = require('../schemas/activity');

module.exports = {
    // Lấy tất cả lịch trình
    GetAllItineraries: async function() {
        return await Itinerary.find()
            .populate('destination_id')
            .populate('activities');
    },
    
    // Lấy chi tiết một lịch trình
    GetItineraryById: async function(id) {
        const itinerary = await Itinerary.findById(id)
            .populate('destination_id')
            .populate('activities');
            
        if (!itinerary) {
            throw new Error('Lịch trình không tồn tại');
        }
        
        return itinerary;
    },
    
    // Tạo lịch trình mới
    CreateItinerary: async function(itineraryData) {
        // Kiểm tra điểm đến có tồn tại không
        const destination = await Destination.findById(itineraryData.destination_id);
        if (!destination) {
            throw new Error('Điểm đến không tồn tại');
        }
        
        const newItinerary = new Itinerary({
            start_date: itineraryData.start_date,
            end_date: itineraryData.end_date,
            destination_id: itineraryData.destination_id
        });
        
        await newItinerary.save();
        
        // Cập nhật mảng itineraries trong destination
        destination.itineraries.push(newItinerary._id);
        await destination.save();
        
        return newItinerary;
    },
    
    // Cập nhật lịch trình
    UpdateItinerary: async function(id, itineraryData) {
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            throw new Error('Lịch trình không tồn tại');
        }
        
        if (itineraryData.start_date) itinerary.start_date = itineraryData.start_date;
        if (itineraryData.end_date) itinerary.end_date = itineraryData.end_date;
        
        // Nếu thay đổi điểm đến
        if (itineraryData.destination_id && itineraryData.destination_id !== itinerary.destination_id.toString()) {
            // Xóa lịch trình khỏi điểm đến cũ
            await Destination.findByIdAndUpdate(
                itinerary.destination_id,
                { $pull: { itineraries: id } }
            );
            
            // Thêm lịch trình vào điểm đến mới
            await Destination.findByIdAndUpdate(
                itineraryData.destination_id,
                { $push: { itineraries: id } }
            );
            
            itinerary.destination_id = itineraryData.destination_id;
        }
        
        await itinerary.save();
        return itinerary;
    },
    
    // Xóa lịch trình
    DeleteItinerary: async function(id) {
        const itinerary = await Itinerary.findById(id);
        if (!itinerary) {
            throw new Error('Lịch trình không tồn tại');
        }
        
        // Xóa các hoạt động liên quan
        await Activity.deleteMany({ itinerary_id: id });
        
        // Xóa lịch trình khỏi điểm đến
        await Destination.findByIdAndUpdate(
            itinerary.destination_id,
            { $pull: { itineraries: id } }
        );
        
        await Itinerary.findByIdAndDelete(id);
        return { message: 'Xóa lịch trình thành công' };
    },
    
    // Lấy lịch trình theo điểm đến
    GetItinerariesByDestination: async function(destinationId) {
        return await Itinerary.find({ destination_id: destinationId })
            .populate('destination_id')
            .populate('activities');
    }
};