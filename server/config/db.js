// config/db.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load .env.test if NODE_ENV is 'test', otherwise load normal .env
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDb;
