import { Router } from 'express';
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import auditLogRouter from "./auditLogRouter";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(auditLogRouter);

export default router;