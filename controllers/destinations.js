const Destination = require('../schemas/destinations');
const Province = require('../schemas/province');
const City = require('../schemas/city');
const DestinationImage = require('../schemas/destinationimages');
const Itinerary = require('../schemas/itinerary');

module.exports = {
    // Lấy tất cả điểm đến
    GetAllDestinations: async function() {
        return await Destination.find()
            .populate('province_id')
            .populate('city_id')
            .populate('destination_images');
    },
    
    // Lấy chi tiết một điểm đến
    GetDestinationById: async function(id) {
        const destination = await Destination.findById(id)
            .populate('province_id')
            .populate('city_id')
            .populate('destination_images')
            .populate({
                path: 'itineraries',
                populate: {
                    path: 'activities'
                }
            });
            
        if (!destination) {
            throw new Error('Điểm đến không tồn tại');
        }
        
        return destination;
    },
    
    // Tạo điểm đến mới
    CreateDestination: async function(destinationData) {
        // Kiểm tra tỉnh và thành phố có tồn tại không
        if (destinationData.province_id) {
            const province = await Province.findById(destinationData.province_id);
            if (!province) {
                throw new Error('Tỉnh không tồn tại');
            }
        }
        
        if (destinationData.city_id) {
            const city = await City.findById(destinationData.city_id);
            if (!city) {
                throw new Error('Thành phố không tồn tại');
            }
        }
        
        const newDestination = new Destination({
            name: destinationData.name,
            description: destinationData.description,
            location: destinationData.location,
            image: destinationData.image,
            ticket_prices_id: destinationData.ticket_prices_id,
            province_id: destinationData.province_id,
            city_id: destinationData.city_id
        });
        
        await newDestination.save();
        return newDestination;
    },
    
    // Cập nhật điểm đến
    UpdateDestination: async function(id, destinationData) {
        const destination = await Destination.findById(id);
        if (!destination) {
            throw new Error('Điểm đến không tồn tại');
        }
        
        // Cập nhật các trường
        if (destinationData.name) destination.name = destinationData.name;
        if (destinationData.description) destination.description = destinationData.description;
        if (destinationData.location) destination.location = destinationData.location;
        if (destinationData.image) destination.image = destinationData.image;
        if (destinationData.ticket_prices_id) destination.ticket_prices_id = destinationData.ticket_prices_id;
        if (destinationData.province_id) destination.province_id = destinationData.province_id;
        if (destinationData.city_id) destination.city_id = destinationData.city_id;
        
        await destination.save();
        return destination;
    },
    
    // Xóa điểm đến
    DeleteDestination: async function(id) {
        // Xóa các hình ảnh liên quan
        await DestinationImage.deleteMany({ destination_id: id });
        
        // Xóa các lịch trình liên quan
        await Itinerary.deleteMany({ destination_id: id });
        
        const result = await Destination.findByIdAndDelete(id);
        if (!result) {
            throw new Error('Điểm đến không tồn tại');
        }
        
        return { message: 'Xóa điểm đến thành công' };
    },
    
    // Thêm hình ảnh cho điểm đến
    AddDestinationImage: async function(destinationId, imageUrl) {
        const destination = await Destination.findById(destinationId);
        if (!destination) {
            throw new Error('Điểm đến không tồn tại');
        }
        
        const newImage = new DestinationImage({
            image_url: imageUrl,
            destination_id: destinationId
        });
        
        await newImage.save();
        
        // Cập nhật mảng destination_images trong destination
        destination.destination_images.push(newImage._id);
        await destination.save();
        
        return newImage;
    },
    
    // Xóa hình ảnh của điểm đến
    DeleteDestinationImage: async function(imageId) {
        const image = await DestinationImage.findById(imageId);
        if (!image) {
            throw new Error('Hình ảnh không tồn tại');
        }
        
        // Cập nhật mảng destination_images trong destination
        await Destination.findByIdAndUpdate(
            image.destination_id,
            { $pull: { destination_images: imageId } }
        );
        
        await DestinationImage.findByIdAndDelete(imageId);
        return { message: 'Xóa hình ảnh thành công' };
    },
    
    // Lấy điểm đến theo tỉnh
    GetDestinationsByProvince: async function(provinceId) {
        return await Destination.find({ province_id: provinceId })
            .populate('province_id')
            .populate('city_id')
            .populate('destination_images');
    },
    
    // Lấy điểm đến theo thành phố
    GetDestinationsByCity: async function(cityId) {
        return await Destination.find({ city_id: cityId })
            .populate('province_id')
            .populate('city_id')
            .populate('destination_images');
    },
    
    // Tìm kiếm điểm đến theo tên
    SearchDestinations: async function(keyword) {
        const regex = new RegExp(keyword, 'i');
        return await Destination.find({ name: { $regex: regex } })
            .populate('province_id')
            .populate('city_id')
            .populate('destination_images');
    }
};