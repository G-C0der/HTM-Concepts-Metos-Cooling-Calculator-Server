import { Router } from 'express';
import { login, getAuthenticatedUser } from "../controllers/AuthController";
import {authMiddlewares, rateLimitedMiddlewares} from "../middlewares";

const authRouter = Router();

authRouter.post('/auth', rateLimitedMiddlewares, login);
authRouter.get('/auth', authMiddlewares, getAuthenticatedUser);

export default authRouter;