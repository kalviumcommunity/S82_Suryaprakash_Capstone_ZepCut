import mongoose from 'mongoose';

// entities and schema
const jobListingSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  location: String,
  salaryRange: {
    min: Number,
    max: Number
  },
  requirements: [String],
  createdAt: { type: Date, default: Date.now },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobApplication' }]
});

export default mongoose.model('JobListing', jobListingSchema);
