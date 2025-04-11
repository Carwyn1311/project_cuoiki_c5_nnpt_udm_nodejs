const City = require('../schemas/city'); 
const Province = require('../schemas/province'); 
const Destination = require('../schemas/destinations'); 

module.exports = {
    // Lấy tất cả thành phố
    GetAllCities: async function() {
        return await City.find().populate('province_id');
    },
    
    // Lấy chi tiết một thành phố
    GetCityById: async function(id) {
        const city = await City.findById(id).populate('province_id');
        if (!city) {
            throw new Error('Thành phố không tồn tại');
        }
        return city;
    },
    
    // Tạo thành phố mới
    CreateCity: async function(name, description, provinceId) {
        // Kiểm tra tỉnh có tồn tại không
        const province = await Province.findById(provinceId);
        if (!province) {
            throw new Error('Tỉnh không tồn tại');
        }
        
        // Kiểm tra tên thành phố đã tồn tại trong tỉnh này chưa
        const existingCity = await City.findOne({ name, province_id: provinceId });
        if (existingCity) {
            throw new Error('Thành phố đã tồn tại trong tỉnh này');
        }
        
        const newCity = new City({
            name,
            description,
            province_id: provinceId
        });
        
        await newCity.save();
        
        // Cập nhật mảng cities trong province
        province.cities.push(newCity._id);
        await province.save();
        
        return newCity;
    },
    
    // Cập nhật thành phố
    UpdateCity: async function(id, cityData) {
        const city = await City.findById(id);
        if (!city) {
            throw new Error('Thành phố không tồn tại');
        }
        
        if (cityData.name) city.name = cityData.name;
        if (cityData.description) city.description = cityData.description;
        
        // Nếu thay đổi tỉnh
        if (cityData.province_id && cityData.province_id !== city.province_id.toString()) {
            // Xóa thành phố khỏi tỉnh cũ
            await Province.findByIdAndUpdate(
                city.province_id,
                { $pull: { cities: id } }
            );
            
            // Thêm thành phố vào tỉnh mới
            await Province.findByIdAndUpdate(
                cityData.province_id,
                { $push: { cities: id } }
            );
            
            city.province_id = cityData.province_id;
        }
        
        await city.save();
        return city;
    },
    
    // Xóa thành phố
    DeleteCity: async function(id) {
        // Kiểm tra xem có điểm đến nào thuộc thành phố này không
        const destinationsCount = await Destination.countDocuments({ city_id: id });
        if (destinationsCount > 0) {
            throw new Error('Không thể xóa thành phố này vì có điểm đến liên quan');
        }
        
        const city = await City.findById(id);
        if (!city) {
            throw new Error('Thành phố không tồn tại');
        }
        
        // Xóa thành phố khỏi tỉnh
        await Province.findByIdAndUpdate(
            city.province_id,
            { $pull: { cities: id } }
        );
        
        await City.findByIdAndDelete(id);
        return { message: 'Xóa thành phố thành công' };
    },
    
    // Lấy thành phố theo tỉnh
    GetCitiesByProvince: async function(provinceId) {
        return await City.find({ province_id: provinceId }).populate('province_id');
    }
};