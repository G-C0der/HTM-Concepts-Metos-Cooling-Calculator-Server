import { Router } from 'express';
import {
  changeActiveState,
  list,
  register, resetPassword,
  sendResetPasswordEmail,
  sendVerificationEmail,
  verify,
  verifyResetPasswordToken
} from "../controllers/UserController";
import {rateLimitedAdminMiddlewares, rateLimitedMiddlewares, rateLimitedOptionalAuthMiddlewares} from "../middlewares";

const userRouter = Router();

userRouter.post('/users', rateLimitedMiddlewares, register);
userRouter.post('/users/verification', rateLimitedMiddlewares, sendVerificationEmail);
userRouter.patch('/users/verification/:token', rateLimitedMiddlewares, verify);
userRouter.post('/users/password-reset', rateLimitedMiddlewares, sendResetPasswordEmail);
userRouter.get('/users/password-reset/:token', rateLimitedMiddlewares, verifyResetPasswordToken);
userRouter.patch('/users/password-reset/:token', rateLimitedOptionalAuthMiddlewares, resetPassword);
userRouter.get('/users', rateLimitedAdminMiddlewares, list);
userRouter.patch('/users/:id', rateLimitedAdminMiddlewares, changeActiveState);

export default userRouter;