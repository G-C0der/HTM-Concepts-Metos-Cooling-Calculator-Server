import { Router } from 'express';
import { login } from "../controllers/AuthController";
import {rateLimiter} from "../middlewares";

const authRouter = Router();

authRouter.post('/auth', rateLimiter, login);

export default authRouter;