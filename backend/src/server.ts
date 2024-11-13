import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRouter from './routes/user.route';

dotenv.config();

// Create server
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/users', userRouter);

// 404 Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send('Invalid route');
});

// Start server
const PORT: number = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
