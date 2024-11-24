"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const hash_util_1 = require("../utils/hash.util");
// Get users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        res.json({ users, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get users' });
    }
});
// Add user
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, accountType } = req.body;
    try {
        const emailExists = yield user_model_1.default.exists({ email });
        if (emailExists) {
            res.status(400).json({ success: false, message: 'Email already in use' });
            return;
        }
        const hashedPassword = yield (0, hash_util_1.hashed)(password);
        const newUser = new user_model_1.default({
            username,
            email,
            password: hashedPassword,
            accountType
        });
        const savedUser = yield newUser.save();
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create user' });
    }
});
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        if (!user.password) {
            res.status(500).json({ success: false, message: 'User password is missing' });
            return;
        }
        const isMatch = yield (0, hash_util_1.compareHash)(password, user.password);
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to login' });
    }
});
// Logout user
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('isAuthenticated', {
        httpOnly: true,
        signed: true
    });
    res.clearCookie('userId', {
        httpOnly: true,
        signed: true
    });
    res.status(200).json({ success: true, message: 'User logged out successfully' });
});
// Check authentication
const checkAuth = (req, res) => {
    res.status(200).json({ success: true, message: 'Auth checked successful' });
};
// Get user by id
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield user_model_1.default.findById(id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ user, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get user' });
    }
});
// Update user by id
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        const emailExists = yield user_model_1.default.findOne({ email, _id: { $ne: id } });
        if (emailExists) {
            res.status(400).json({ success: false, message: 'Email already in use' });
            return;
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, { username, email }, { new: true, runValidators: true });
        if (!updatedUser) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ user: updatedUser, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user' });
    }
});
// Delete user by id
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const isDeleted = yield user_model_1.default.findByIdAndDelete(id);
        if (!isDeleted) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'User deleted' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
});
exports.default = {
    getUsers,
    addUser,
    loginUser,
    logoutUser,
    checkAuth,
    getUserById,
    updateUserById,
    deleteUserById
};
