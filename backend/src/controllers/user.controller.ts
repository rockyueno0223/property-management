import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { User } from '../types/user';
import { hashed, compareHash } from '../utils/hash.util';

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

// Login user
const loginUser = async (req: Request<{}, {}, User>, res: Response) => {
  const { name, password } = req.body;
  const user = userModel.findByName(name);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  const isMatch = await compareHash(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Password is invalid' });
    return;
  }
  res.cookie('isAuthenticated', true, {
    httpOnly: true,
    maxAge: 3 * 60 * 1000,
    signed: true
  });
  res.cookie('userId', user.id, {
    httpOnly: true,
    maxAge: 3 * 60 * 1000,
    signed: true
  });
  res.status(200).json({ user, success: true, message: 'Login authenticated' });
};

// Logout user
const logoutUser = async (req: Request<{}, {}, User>, res: Response) => {
  res.clearCookie('isAuthenticated', {
    httpOnly: true,
    signed: true
  });
  res.clearCookie('userId', {
    httpOnly: true,
    signed: true
  });
  res.status(200).json({ message: 'User logged out successfully' });
};

// Check authentication
const checkAuth = (req: Request, res: Response) => {
  res.status(200).send('Auth checked successful');
};

export default {
  getUsers,
  addUser,
  loginUser,
  logoutUser,
  checkAuth
};
