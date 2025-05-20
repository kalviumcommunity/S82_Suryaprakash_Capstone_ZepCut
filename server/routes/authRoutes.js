import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authmiddleware.js';
import {listUser} from '../controllers/authController.js'
import User1 from '../src/models/User1.model.js';


const router = express.Router();

router.post('/signup', signupUser);     // Public - user registration
router.post('/login', loginUser);       // Public - user login

// Example of a protected route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User1.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Protected profile info', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
 });

router.get('/user', verifyToken, listUser)

export default router;
