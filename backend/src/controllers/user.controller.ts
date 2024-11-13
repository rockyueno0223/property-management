import { Request, Response } from 'express';
import userModel from '../models/user.model';

// Get users
const getUsers = (req: Request, res: Response) => {
  const users = userModel.findAll();
  res.json(users);
};

export default { getUsers };
