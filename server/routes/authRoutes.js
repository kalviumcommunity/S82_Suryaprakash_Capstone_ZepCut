import express from 'express';
import { signupUser, loginUser } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authmiddleware.js';
import {listUser} from '../controllers/authController.js'


const router = express.Router();

router.post('/signup', signupUser);     // Public - user registration
router.post('/login', loginUser);       // Public - user login

// Example of a protected route
router.get('/profile', verifyToken, (req, res) => {
  // Access user info from req.user
  res.json({ message: 'Protected profile info', user: req.user });
});

router.get('/user',listUser)

export default router;
