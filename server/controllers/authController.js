import User from '../src/models/User1.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// SIGNUP
export const signupUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userSafe = user.toObject();
    delete userSafe.password;

    res.status(200).json({ token, user: userSafe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//Get details for logind users
export const listUser = async(req,res)=>{
      try{
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({error:err.message});
    }
}

     