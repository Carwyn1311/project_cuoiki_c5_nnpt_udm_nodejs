const User = require('../schemas/user');
const Role = require('../schemas/role');
const bcrypt = require('bcrypt');

module.exports = {
    // Đăng nhập
    Login: async function(username, password) {
        const user = await User.findOne({ username }).populate('roles');
        if (!user) {
            throw new Error('Tài khoản không tồn tại');
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Mật khẩu không chính xác');
        }
        
        return user;
    },
    
    // Tạo người dùng mới
    CreateAnUser: async function(username, password, email, roleName = 'User') {
        // Kiểm tra username đã tồn tại chưa
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new Error('Tên đăng nhập hoặc email đã tồn tại');
        }
        
        // Tìm role
        const role = await Role.findOne({ name: roleName });
        if (!role) {
            throw new Error('Vai trò không tồn tại');
        }
        
        // Tạo người dùng mới
        const newUser = new User({
            username,
            password,
            email,
            roles: [role._id]
        });
        
        await newUser.save();
        return newUser;
    },
    
    // Lấy thông tin người dùng theo ID
    GetUserById: async function(id) {
        const user = await User.findById(id).populate('roles');
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }
        return user;
    },
    
    // Lấy thông tin người dùng theo email
    GetUserByEmail: async function(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email không tồn tại');
        }
        return user;
    },
    
    // Lấy danh sách tất cả người dùng (cho Admin)
    GetAllUsers: async function() {
        return await User.find().populate('roles');
    },
    
    // Cập nhật thông tin người dùng
    UpdateUser: async function(id, userData) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }
        
        // Cập nhật các trường thông tin
        if (userData.fullname) user.fullname = userData.fullname;
        if (userData.address) user.address = userData.address;
        if (userData.phone) user.phone = userData.phone;
        if (userData.avata) user.avata = userData.avata;
        
        await user.save();
        return user;
    },
    
    // Cập nhật vai trò người dùng (chỉ Admin)
    UpdateUserRole: async function(userId, roleIds) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Người dùng không tồn tại');
        }
        
        user.roles = roleIds;
        await user.save();
        return await User.findById(userId).populate('roles');
    },
    
    // Xóa người dùng (chỉ Admin)
    DeleteUser: async function(id) {
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            throw new Error('Người dùng không tồn tại');
        }
        return { message: 'Xóa người dùng thành công' };
    }
};