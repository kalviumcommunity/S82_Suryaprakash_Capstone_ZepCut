import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;  // Only require password if not using Google login
      },
      minlength: 6,
    },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      default: 'customer',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User1', userSchema);
