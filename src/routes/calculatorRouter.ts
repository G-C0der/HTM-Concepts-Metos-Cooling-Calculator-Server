import { Router } from 'express';
import {authenticate} from "../middlewares";
import {save} from "../controllers/CalculatorController";

const calculatorRouter = Router();

calculatorRouter.post('/calculations', authenticate, save);

export default calculatorRouter;