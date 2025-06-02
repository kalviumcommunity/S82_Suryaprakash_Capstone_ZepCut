import User from '../src/models/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Don't forget this
// Make sure to have JWT_SECRET in your .env

// Manual validation function
function validateUserData(data) {
  const { name, email, password, role, phone, location } = data;
  if (!name || !email || !password || !role || !phone || !location)
    return 'All fields (name, email, password, role, phone, location) are required.';

  const validRoles = ['customer', 'salon', 'barber'];
  if (!validRoles.includes(role)) return 'Invalid role';

  if (
    !location.type || location.type !== 'Point' ||
    !Array.isArray(location.coordinates) ||
    location.coordinates.length !== 2 ||
    !location.coordinates.every(coord => typeof coord === 'number')
  ) return 'Invalid location';

  return null;
}

// A - Create User
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
    console.error('CreateUser error:', err);
    res.status(500).json({ error: err.message });
  }
};

// B - Delete User
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

// G - Get All Users (with pagination)
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

// G - Get User By ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// L - Login User
export const loginUser = async (req, res) => {
  try {
    console.log('Login req.body:', req.body);

    const { email, password } = req.body;

    // Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    // console.log('User object after findOne:', user);

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!password || !user.password) {
      console.log('Missing password in request or database');
      return res.status(400).json({ message: 'Missing credentials' });
    }

    console.log('Stored hashed password:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Incorrect password provided');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (isMatch){
      console.log('User object after findOne:', user);
    }

    // Only generate token if password is correct
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    console.log('Generated token:', token); // Optional: for debugging

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePhotoUrl: user.profilePhotoUrl,
      },
    });
  } catch (err) {
    console.error('Login Error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};





// U - Update User
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
