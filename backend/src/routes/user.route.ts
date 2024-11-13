import { Router, Request, Response } from 'express';
import userController from '../controllers/user.controller';
import { cookieAuthCheck } from '../middleware/auth';

const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.post('/sign-up', userController.addUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/logout', userController.logoutUser);
userRouter.get('/check-auth', cookieAuthCheck, userController.checkAuth);

userRouter.get('/:id', userController.getUserById);
userRouter.put('/:id', userController.updateUserById);
userRouter.delete('/:id', userController.deleteUserById);

export default userRouter;
