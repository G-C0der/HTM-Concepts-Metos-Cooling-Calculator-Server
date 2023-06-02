import { Router } from 'express';
import {register, sendVerificationEmail, verify} from "../controllers/UserController";
import {rateLimiter} from "../middlewares";

const userRouter = Router();

userRouter.post('/users', rateLimiter, register);
userRouter.post('/users/verification/send', rateLimiter, sendVerificationEmail);
userRouter.post('/users/verification/:token', rateLimiter, verify);

export default userRouter;