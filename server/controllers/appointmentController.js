const Appointment = require('../models/Appointment');

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all appointments (optionally filtered by userId or salonId)
exports.getAppointments = async (req, res) => {
  try {
    const filter = {};
    if (req.query.userId) filter.user = req.query.userId;
    if (req.query.salonId) filter.salon = req.query.salonId;

    const appointments = await Appointment.find(filter).populate('user salon');
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single appointment
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate('user salon');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

