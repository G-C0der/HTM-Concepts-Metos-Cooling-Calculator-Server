import { Router } from 'express';
import {authenticate} from "../middlewares";
import {list, save} from "../controllers/CalculatorController";

const calculatorRouter = Router();

calculatorRouter.post('/calculations', authenticate, save);
calculatorRouter.get('/calculations', authenticate, list);

export default calculatorRouter;