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
const getUsers = (req, res) => {
    const users = user_model_1.default.findAll();
    res.json({ users, success: true });
};
// Add user
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, accountType } = req.body;
    const emailExists = user_model_1.default.findAll().some((user) => user.email === email);
    if (emailExists) {
        res.status(400).json({ success: false, message: 'Email already in use' });
        return;
    }
    const hashedPassword = yield (0, hash_util_1.hashed)(password);
    const user = user_model_1.default.createUser({ username, email, password: hashedPassword, accountType });
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
    }
    else {
        res.status(500).json({ success: false, message: 'Failed to create user' });
    }
});
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = user_model_1.default.findByEmail(email);
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    const isMatch = yield (0, hash_util_1.compareHash)(password, user.password);
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
const getUserById = (req, res) => {
    const { id } = req.params;
    const user = user_model_1.default.findById(id);
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    res.json({ user, success: true });
};
// Update user by id
const updateUserById = (req, res) => {
    const { id } = req.params;
    const { username, email } = req.body;
    const emailExists = user_model_1.default.findAll().some((user) => user.email === email);
    if (emailExists) {
        res.status(400).json({ success: false, message: 'Email already in use' });
        return;
    }
    const user = user_model_1.default.editUser(id, { username, email });
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }
    res.status(200).json({ user, success: true });
};
// Delete user by id
const deleteUserById = (req, res) => {
    const { id } = req.params;
    const isDeleted = user_model_1.default.deleteUser(id);
    if (!isDeleted) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    res.status(200).json({ success: true, message: 'User deleted' });
};
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
