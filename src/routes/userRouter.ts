import { Router } from 'express';
import {register, sendVerificationEmail} from "../controllers/UserController";

const userRouter = Router();

userRouter.post('/users', register);
userRouter.post('/users/verification/send', sendVerificationEmail);

export default userRouter;