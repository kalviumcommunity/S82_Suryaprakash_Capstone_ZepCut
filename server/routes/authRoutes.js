import express from 'express';
import { signupUser, loginUser, listUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authmiddleware.js';
import User1 from '../src/models/User1.model.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Normal Auth Routes
router.post('/signup', signupUser);
router.post('/login', loginUser);

// Protected Route Example
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User1.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Protected profile info', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user', verifyToken, listUser);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

export default router;
