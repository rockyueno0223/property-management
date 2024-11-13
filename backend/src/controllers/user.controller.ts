import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { User } from '../types/user';
import { hashed } from '../utils/hash.util';

// Get users
const getUsers = (req: Request, res: Response) => {
  const users = userModel.findAll();
  res.json(users);
};

// Add user
const addUser = async (req: Request<{}, {}, User>, res: Response) => {
  const { name, password, accountType } = req.body;
  const hashedPassword = await hashed(password);
  const user = userModel.createUser({ name, password: hashedPassword, accountType });

  if (user) {
    res.cookie('isAuthenticated', true, {
      httpOnly: true,
      maxAge: 3 * 60 * 1000,
      signed: true,
    });
    res.cookie('userId', user.id, {
      httpOnly: true,
      maxAge: 3 * 60 * 1000,
      signed: true,
    });
    res.status(201).json({ user, success: true });
  }
};

export default {
  getUsers,
  addUser
};
