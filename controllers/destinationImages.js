const DestinationImage = require('../schemas/destinationimages');
const Destination = require('../schemas/destinations');

module.exports = {
    // Lấy tất cả hình ảnh điểm đến
    GetAllDestinationImages: async function() {
        return await DestinationImage.find().populate('destination_id');
    },
    
    // Lấy chi tiết một hình ảnh
    GetDestinationImageById: async function(id) {
        const image = await DestinationImage.findById(id).populate('destination_id');
        if (!image) {
            throw new Error('Hình ảnh không tồn tại');
        }
        return image;
    },
    
    // Tạo hình ảnh mới
    CreateDestinationImage: async function(imageUrl, destinationId) {
        // Kiểm tra điểm đến có tồn tại không
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
    
    // Cập nhật hình ảnh
    UpdateDestinationImage: async function(id, imageUrl) {
        const image = await DestinationImage.findById(id);
        if (!image) {
            throw new Error('Hình ảnh không tồn tại');
        }
        
        image.image_url = imageUrl;
        await image.save();
        return image;
    },
    
    // Xóa hình ảnh
    DeleteDestinationImage: async function(id) {
        const image = await DestinationImage.findById(id);
        if (!image) {
            throw new Error('Hình ảnh không tồn tại');
        }
        
        // Xóa hình ảnh khỏi destination
        await Destination.findByIdAndUpdate(
            image.destination_id,
            { $pull: { destination_images: id } }
        );
        
        await DestinationImage.findByIdAndDelete(id);
        return { message: 'Xóa hình ảnh thành công' };
    },
    
    // Lấy hình ảnh theo điểm đến
    GetImagesByDestination: async function(destinationId) {
        return await DestinationImage.find({ destination_id: destinationId });
    }
};