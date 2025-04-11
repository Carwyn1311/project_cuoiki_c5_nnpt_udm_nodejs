const Role = require('../schemas/role');

module.exports = {
    // Lấy tất cả vai trò
    GetAllRoles: async function() {
        return await Role.find();
    },
    
    // Tạo vai trò mới
    CreateRole: async function(name) {
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            throw new Error('Vai trò đã tồn tại');
        }
        
        const newRole = new Role({ name });
        await newRole.save();
        return newRole;
    },
    
    // Cập nhật vai trò
    UpdateRole: async function(id, name) {
        const role = await Role.findById(id);
        if (!role) {
            throw new Error('Vai trò không tồn tại');
        }
        
        role.name = name;
        await role.save();
        return role;
    },
    
    // Xóa vai trò
    DeleteRole: async function(id) {
        const result = await Role.findByIdAndDelete(id);
        if (!result) {
            throw new Error('Vai trò không tồn tại');
        }
        return { message: 'Xóa vai trò thành công' };
    }
};