import { Request, Response } from 'express';
import userModel from '../models/user.model';
import { User } from '../../../shared/types/user';
import { hashed, compareHash } from '../utils/hash.util';

// Get users
const getUsers = (req: Request, res: Response) => {
  const users = userModel.findAll();
  res.json({ users, success: true });
};

// Add user
const addUser = async (req: Request<{}, {}, User>, res: Response) => {
  const { username, email, password, accountType } = req.body;

  const emailExists = userModel.findAll().some((user) => user.email === email);
  if (emailExists) {
    res.status(400).json({ success: false, message: 'Email already in use' });
    return;
  }

  const hashedPassword = await hashed(password);
  const user = userModel.createUser({ username, email, password: hashedPassword, accountType });

  if (user) {
    res.cookie('isAuthenticated', true, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // change later
      signed: true,
    });
    res.cookie('userId', user.id, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // change later
      signed: true,
    });
    res.status(201).json({ user, success: true });
  } else {
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};

// Login user
const loginUser = async (req: Request<{}, {}, User>, res: Response) => {
  const { email, password } = req.body;
  const user = userModel.findByEmail(email);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  const isMatch = await compareHash(password, user.password);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Password is invalid' });
    return;
  }
  res.cookie('isAuthenticated', true, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // change later
    signed: true
  });
  res.cookie('userId', user.id, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // change later
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
  res.status(200).json({ success: true, message: 'User logged out successfully' });
};

// Check authentication
const checkAuth = (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Auth checked successful' });
};

// Get user by id
const getUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const user = userModel.findById(id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ user, success: true });
};

// Update user by id
const updateUserById = (req: Request<{ id: string }, {}, User>, res: Response) => {
  const { id } = req.params;
  const { username, email } = req.body;

  const emailExists = userModel.findAll().some((user) => user.email === email);
  if (emailExists) {
    res.status(400).json({ success: false, message: 'Email already in use' });
    return;
  }

  const user = userModel.editUser(id, { username, email });
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }
  res.status(200).json({ user, success: true });
};

// Delete user by id
const deleteUserById = (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const isDeleted = userModel.deleteUser(id);
  if (!isDeleted) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.status(200).json({ success: true, message: 'User deleted'});
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
