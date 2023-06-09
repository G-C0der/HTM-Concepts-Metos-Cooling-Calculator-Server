import { Router } from 'express';
import {
  register, resetPassword,
  sendResetPasswordEmail,
  sendVerificationEmail,
  verify,
  verifyResetPasswordToken
} from "../controllers/UserController";
import {rateLimiter} from "../middlewares";

const userRouter = Router();

userRouter.post('/users', rateLimiter, register);
userRouter.post('/users/verification', rateLimiter, sendVerificationEmail);
userRouter.patch('/users/verification/:token', rateLimiter, verify);
userRouter.post('/users/password-reset', rateLimiter, sendResetPasswordEmail);
userRouter.get('/users/password-reset/:token', rateLimiter, verifyResetPasswordToken);
userRouter.patch('/users/password-reset/:token', rateLimiter, resetPassword);

export default userRouter;