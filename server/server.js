import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db.js';
import userRoutes from './routes/userRoutes.js';  
import jobRoutes from './routes/jobRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDb();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to Zep-Cut!');
});

// Start server
const PORT = process.env.PORT || 5000;

console.log("Loading routes...");
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
