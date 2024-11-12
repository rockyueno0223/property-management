import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Create server
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes

// 404 Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send('Invalid route');
});

// Start server
const PORT: number = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
