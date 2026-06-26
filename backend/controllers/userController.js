const User = require('../models/User');

// @desc    Update profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, rollNumber, department, semester, phone, avatarColor, profileImage, password } = req.body;

    if (name !== undefined) user.name = name;
    if (rollNumber !== undefined) user.rollNumber = rollNumber;
    if (department !== undefined) user.department = department;
    if (semester !== undefined) user.semester = semester;
    if (phone !== undefined) user.phone = phone;
    if (avatarColor !== undefined) user.avatarColor = avatarColor;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (password) user.password = password;

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      rollNumber: updated.rollNumber,
      department: updated.department,
      semester: updated.semester,
      phone: updated.phone,
      avatarColor: updated.avatarColor,
      profileImage: updated.profileImage,
      createdAt: updated.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile };
