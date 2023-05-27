import { Router } from 'express';
import { login } from "../controllers/AuthController";

const authRouter = Router();

authRouter.post('/auth', login);

export default authRouter;