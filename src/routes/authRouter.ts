import { Router } from 'express';
import { login } from "../controllers/AuthController";

const authRouter = Router();

authRouter.post('/login', login);

export default authRouter;