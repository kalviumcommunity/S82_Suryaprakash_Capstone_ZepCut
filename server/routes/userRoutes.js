import express from 'express';
const router = express.Router();

import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser
} from '../controllers/userController.js';

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

export default router;
