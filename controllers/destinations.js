const Destination = require('../schemas/Destination'); 

// Tạo mới Destination
exports.create = async (req, res) => {
  try {
    const { name, province } = req.body;
    
    // Tạo đối tượng Destination từ dữ liệu yêu cầu
    const newDestination = new Destination({
      name,
      province
    });
    
    // Lưu Destination vào database
    const savedDestination = await newDestination.save();
    res.status(201).json({ success: true, data: savedDestination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật Destination theo ID
exports.update = async (req, res) => {
  try {
    const { name, province } = req.body;
    
    // Cập nhật Destination theo ID
    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      { name, province },
      { new: true } // Trả về bản cập nhật mới
    );

    if (!updatedDestination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.status(200).json({ success: true, message: 'Destination updated successfully', data: updatedDestination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy thông tin Destination theo ID
exports.getById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });

    res.status(200).json({ success: true, data: destination });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả Destinations
exports.getAll = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json({ success: true, data: destinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Tạo mới ảnh cho Destination
exports.createImg = async (req, res) => {
  try {
    const { destinationId, imageUrl } = req.body;

    // Tạo mới ảnh cho destination
    const newImage = new DestinationImage({ destination: destinationId, image_url: imageUrl });
    await newImage.save();

    res.status(201).json({ success: true, message: 'Image added successfully', data: newImage });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa ảnh của Destination
exports.deleteImg = async (req, res) => {
  try {
    const imageId = req.params.id;
    await DestinationImage.findByIdAndDelete(imageId);
    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả các Destinations trong nước
exports.getDomesticDestinations = async (req, res) => {
  try {
    const domesticDestinations = await Destination.find({ isInternational: false });
    res.status(200).json({ success: true, data: domesticDestinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy tất cả các Destinations quốc tế
exports.getInternationalDestinations = async (req, res) => {
  try {
    const internationalDestinations = await Destination.find({ isInternational: true });
    res.status(200).json({ success: true, data: internationalDestinations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
