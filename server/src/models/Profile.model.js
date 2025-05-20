import mongoose from 'mongoose';

// entities and schema
const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bio: String,
  experience: Number,
  servicesOffered: [String],
  portfolioImages: [String],
  certifications: [String],
  ratingsAverage: Number,
  ratingsCount: Number
});

export default mongoose.model('Profile', profileSchema);
