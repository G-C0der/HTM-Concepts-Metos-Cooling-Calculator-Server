import { Router } from 'express';
import { login, getAuthenticatedUser } from "../controllers/AuthController";
import {authenticate, rateLimiter} from "../middlewares";

const authRouter = Router();

authRouter.post('/auth', rateLimiter, login);
authRouter.get('/auth', authenticate(), getAuthenticatedUser);

export default authRouter;