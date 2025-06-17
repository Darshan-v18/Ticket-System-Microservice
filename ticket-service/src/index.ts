import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import ticketRoutes from './routes/ticketRoutes';
import { connectKafka } from './kafka/producer';


const app = express();
app.use(express.json());
app.use('/api/tickets', ticketRoutes);
const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI!;

mongoose.connect(MONGO_URI)
  .then(async() => {
    await connectKafka();
    console.log('🔗 Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Ticket Service running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });
