const Province = require('../schemas/province');
const City = require('../schemas/city');

module.exports = {
    // Lấy tất cả tỉnh
    GetAllProvinces: async function() {
        return await Province.find().populate('cities');
    },
    
    // Lấy chi tiết một tỉnh
    GetProvinceById: async function(id) {
        const province = await Province.findById(id).populate('cities');
        if (!province) {
            throw new Error('Tỉnh không tồn tại');
        }
        return province;
    },
    
    // Tạo tỉnh mới
    CreateProvince: async function(name, country = 'Vietnam') {
        const existingProvince = await Province.findOne({ name });
        if (existingProvince) {
            throw new Error('Tỉnh đã tồn tại');
        }
        
        const newProvince = new Province({
            name,
            country
        });
        
        await newProvince.save();
        return newProvince;
    },
    
    // Cập nhật tỉnh
    UpdateProvince: async function(id, provinceData) {
        const province = await Province.findById(id);
        if (!province) {
            throw new Error('Tỉnh không tồn tại');
        }
        
        if (provinceData.name) province.name = provinceData.name;
        if (provinceData.country) province.country = provinceData.country;
        
        await province.save();
        return province;
    },
    
    // Xóa tỉnh
    DeleteProvince: async function(id) {
        // Kiểm tra xem có thành phố nào thuộc tỉnh này không
        const citiesCount = await City.countDocuments({ province_id: id });
        if (citiesCount > 0) {
            throw new Error('Không thể xóa tỉnh này vì có thành phố liên quan');
        }
        
        const result = await Province.findByIdAndDelete(id);
        if (!result) {
            throw new Error('Tỉnh không tồn tại');
        }
        
        return { message: 'Xóa tỉnh thành công' };
    }
};