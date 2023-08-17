import { Router } from 'express';
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import auditLogRouter from "./auditLogRouter";
import calculatorRouter from "./calculatorRouter";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(auditLogRouter);
router.use(calculatorRouter);

export default router;