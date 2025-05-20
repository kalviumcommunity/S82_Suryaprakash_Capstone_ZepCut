import express from 'express';
const router = express.Router();

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

import { verifyToken } from '../middleware/authmiddleware.js'; // 👈 Import the middleware

// PUBLIC ROUTE - User Registration
router.post('/register', createUser); // POST /api/users/register

// PROTECTED ROUTES - Require valid JWT
router.get('/', verifyToken, getAllUsers);      // GET /api/users
router.get('/:id', verifyToken, getUserById);   // GET /api/users/:id
router.put('/:id', verifyToken, updateUser);    // PUT /api/users/:id
router.delete('/:id', verifyToken, deleteUser); // DELETE /api/users/:id

export default router;
