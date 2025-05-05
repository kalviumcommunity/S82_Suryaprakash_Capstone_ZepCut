const Appointment = require('../models/Appointment');
const Joi = require('joi');

const appointmentSchema = Joi.object({
  user: Joi.string().required(),
  salon: Joi.string().required(),
  date: Joi.date().iso().required(),
  time: Joi.string().required(),
  service: Joi.string().required(),
});

exports.createAppointment = async (req, res) => {
  const { error } = appointmentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

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
// Update Appointment
exports.updateAppointment = async (req, res) => {
    try {
      const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!appt) return res.status(404).json({ message: 'Appointment not found' });
      res.status(200).json(appt);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

  
