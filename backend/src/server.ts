import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.route';
import propertyRouter from './routes/property.route';
import mongoose from 'mongoose';

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => { console.log('MongoDB is connected.') })
  .catch((error) => { console.error(error) });

// Create server
const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser(process.env.COOKIE_SIGN_KEY));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Routes
app.use('/api/users', userRouter);
app.use('/api/properties', propertyRouter);

// 404 Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send('Invalid route');
});

// Start server
const PORT: number = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
