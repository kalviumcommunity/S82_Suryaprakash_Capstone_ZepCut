import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['salon', 'barber', 'customer'],
    required: true
  },
  profilePhotoUrl: {
    type: String,
    default: ''
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  address: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Geospatial index
userSchema.index({ location: '2dsphere' });

export default mongoose.model('User', userSchema);
