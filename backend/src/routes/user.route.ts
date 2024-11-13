import { Router, Request, Response } from 'express';
import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.get('/', userController.getUsers);
userRouter.post('/sign-up', userController.addUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/logout', userController.logoutUser);

export default userRouter;
