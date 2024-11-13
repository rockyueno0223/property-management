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
    res.json(users);
};
// Add user
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password, accountType } = req.body;
    const hashedPassword = yield (0, hash_util_1.hashed)(password);
    const user = user_model_1.default.createUser({ name, password: hashedPassword, accountType });
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
});
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    const user = user_model_1.default.findByName(name);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    const isMatch = yield (0, hash_util_1.compareHash)(password, user.password);
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
    res.status(200).json({ message: 'User logged out successfully' });
});
// Check authentication
const checkAuth = (req, res) => {
    res.status(200).send('Auth checked successful');
};
exports.default = {
    getUsers,
    addUser,
    loginUser,
    logoutUser,
    checkAuth
};
