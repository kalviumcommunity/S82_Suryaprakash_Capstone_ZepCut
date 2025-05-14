import User from '../src/models/User.model.js';
import bcrypt from 'bcrypt';

// Manual validation function
function validateUserData(data) {
  const { name, email, password, role } = data;
  if (!name || !email || !password || !role)
    return 'All fields (name, email, password, role) are required.';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format.';

  if (password.length < 6) return 'Password must be at least 6 characters.';

  const validRoles = ['customer', 'salon', 'barber', 'admin'];
  if (!validRoles.includes(role))
    return 'Role must be customer, salon, barber, or admin.';

  return null;
}

// Create User
export const createUser = async (req, res) => {
  const error = validateUserData(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const { name, email, password, role, phone, address, location, profilePhotoUrl } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      location,
      profilePhotoUrl
    });

    await user.save();

    const userSafe = { ...user._doc };
    delete userSafe.password;

    res.status(201).json(userSafe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users with pagination & field filtering
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({}, 'name email role phone profilePhotoUrl')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID (excluding password)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user (only allowed fields)
export const updateUser = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'phone', 'address', 'profilePhotoUrl', 'location', 'role'];
    const updateData = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
