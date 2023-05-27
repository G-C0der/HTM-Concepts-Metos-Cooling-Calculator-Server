import { Router } from 'express';
import { register } from "../controllers/UserController";

const userRouter = Router();

userRouter.post('/users', register);

export default userRouter;