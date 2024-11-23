import { Request, Response } from 'express';
import User from '../models/user.model';
import { hashed, compareHash } from '../utils/hash.util';

// Get users
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json({ users, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
};

// Add user
const addUser = async (req: Request, res: Response) => {
  const { username, email, password, accountType } = req.body;

  try {
    const emailExists = await User.exists({ email });
    if (emailExists) {
      res.status(400).json({ success: false, message: 'Email already in use' });
      return;
    }

    const hashedPassword = await hashed(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      accountType
    });
    const savedUser = await newUser.save();

    res.cookie('isAuthenticated', true, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('userId', savedUser._id.toString(), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(201).json({ user: savedUser, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};

// Login user
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    if (!user.password) {
      res.status(500).json({ success: false, message: 'User password is missing' });
      return;
    }
    const isMatch = await compareHash(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Password is invalid' });
      return;
    }

    res.cookie('isAuthenticated', true, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('userId', user._id.toString(), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      signed: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(200).json({ user, success: true, message: 'Login authenticated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to login' });
  }
};

// Logout user
const logoutUser = async (req: Request, res: Response) => {
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
const getUserById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ user, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user' });
  }
};

// Update user by id
const updateUserById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const emailExists = await User.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      res.status(400).json({ success: false, message: 'Email already in use' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.status(200).json({ user: updatedUser, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

// Delete user by id
const deleteUserById = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  try {
    const isDeleted = await User.findByIdAndDelete(id);
    if (!isDeleted) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'User deleted'});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
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
