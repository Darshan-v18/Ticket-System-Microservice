import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes'


const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI!;

mongoose.connect(MONGO_URI).then(() => {
  console.log('🔗 Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Auth Service running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
