import { Router } from 'express';
import { login, getAuthenticatedUser } from "../controllers/AuthController";
import {rateLimiter} from "../middlewares";

const authRouter = Router();

authRouter.post('/auth', rateLimiter, login);
authRouter.get('/auth', getAuthenticatedUser);

export default authRouter;