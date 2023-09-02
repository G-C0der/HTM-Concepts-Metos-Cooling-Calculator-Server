import { Router } from 'express';
import {authenticate} from "../middlewares";
import {fetch, list, save, remove} from "../controllers/CalculatorController";

const calculatorRouter = Router();

calculatorRouter.post('/calculations', authenticate, save);
calculatorRouter.get('/calculations', authenticate, list);
calculatorRouter.get('/calculations/in-use', authenticate, fetch);
calculatorRouter.delete('/calculations/:id', authenticate, remove);

export default calculatorRouter;