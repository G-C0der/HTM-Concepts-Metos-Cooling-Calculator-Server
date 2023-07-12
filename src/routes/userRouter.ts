import { Router } from 'express';
import {
  changeActiveState, editProfile,
  list,
  register, resetPassword,
  sendResetPasswordEmail,
  sendVerificationEmail,
  verify,
  verifyResetPasswordToken
} from "../controllers/UserController";
import {
  authenticate,
  authorize,
  rateLimiter
} from "../middlewares";

const userRouter = Router();

userRouter.post('/users', rateLimiter, register);
userRouter.post('/users/verification', rateLimiter, sendVerificationEmail);
userRouter.patch('/users/verification/:token', rateLimiter, verify);
userRouter.post('/users/password-reset', rateLimiter, sendResetPasswordEmail);
userRouter.get('/users/password-reset/:token', rateLimiter, verifyResetPasswordToken);
userRouter.patch('/users/password-reset/:token', rateLimiter, authenticate(false), resetPassword);
userRouter.patch('/users', rateLimiter, authenticate, editProfile);
userRouter.patch('/users/:id', rateLimiter, authenticate, authorize, editProfile);
userRouter.get('/users', rateLimiter, authenticate(), authorize, list);
userRouter.patch('/users/:id', rateLimiter, authenticate(), authorize, changeActiveState);

export default userRouter;