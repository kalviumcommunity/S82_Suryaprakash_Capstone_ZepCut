const Appointment = require('../models/Appointment');


// Get All Appointments
exports.getAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find().populate('customer barber');
    res.status(200).json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id).populate('customer barber');
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

