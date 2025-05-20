import mongoose from 'mongoose';

// entities and schema
const appointmentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledDate: Date,
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  service: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Appointment", appointmentSchema);
