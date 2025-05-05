const mongoose = require('mongoose');

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

module.exports = mongoose.model('Profile', profileSchema);
