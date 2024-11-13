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

// Get user by id
const getUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const user = userModel.findById(id);
  if (!user) {
    res.status(404).send('User not found');
    return;
  }
  res.json(user);
};

// Update user by id
const updateUserById = (req: Request<{ id: string }, {}, User>, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const user = userModel.editUser(id, { name });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json(user);
};

// Delete user by id
const deleteUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = userModel.deleteUser(id);
  if (!isDeleted) {
    res.status(404).send('User not found');
    return;
  }
  res.status(200).send('User deleted');
};

export default {
  getUsers,
  addUser,
  loginUser,
  logoutUser,
  checkAuth,
  getUserById,
  updateUserById,
  deleteUserById
};
