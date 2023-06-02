import { Router } from 'express';
import {register, sendVerificationEmail} from "../controllers/UserController";
import {rateLimiter} from "../middlewares";

const userRouter = Router();

userRouter.post('/users', register);
userRouter.post('/users/verification/send', rateLimiter, sendVerificationEmail);

export default userRouter;