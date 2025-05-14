import express from 'express';
const router = express.Router();

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser
} from '../controllers/userController.js';

// POST: Create a new user
router.post('/register', createUser);   // Use `/register` instead of root for clarity

// GET: Get all users
router.get('/', getAllUsers);

// GET: Get user by ID
router.get('/:id', getUserById);

// PUT: Update user by ID
router.put('/:id', updateUser);

export default router;
