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
  rateLimitedAdminMiddlewares,
  rateLimitedAuthMiddlewares,
  rateLimitedMiddlewares,
  rateLimitedOptionalAuthMiddlewares
} from "../middlewares";

const userRouter = Router();

userRouter.post('/users', rateLimitedMiddlewares, register);
userRouter.post('/users/verification', rateLimitedMiddlewares, sendVerificationEmail);
userRouter.patch('/users/verification/:token', rateLimitedMiddlewares, verify);
userRouter.post('/users/password-reset', rateLimitedMiddlewares, sendResetPasswordEmail);
userRouter.get('/users/password-reset/:token', rateLimitedMiddlewares, verifyResetPasswordToken);
userRouter.patch('/users/password-reset/:token', rateLimitedOptionalAuthMiddlewares, resetPassword);
userRouter.patch('/users', rateLimitedAuthMiddlewares, editProfile);
userRouter.patch('/users/:id', rateLimitedAdminMiddlewares, editProfile);
userRouter.get('/users', rateLimitedAdminMiddlewares, list);
userRouter.patch('/users/:id', rateLimitedAdminMiddlewares, changeActiveState);

export default userRouter;