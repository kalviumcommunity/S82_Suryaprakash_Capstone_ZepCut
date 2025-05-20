import mongoose from 'mongoose';

// entities and schema
const jobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing' },
  barberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now }
});

export default mongoose.model('JobApplication', jobApplicationSchema);
