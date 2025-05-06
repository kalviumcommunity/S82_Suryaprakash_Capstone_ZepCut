import express from 'express';
const router = express.Router();

import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment
} from '../controllers/appointmentController.js';

// Routes
router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);

export default router;
