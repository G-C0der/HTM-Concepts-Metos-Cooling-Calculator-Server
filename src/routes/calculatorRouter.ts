import { Router } from 'express';
import {authenticate, authorize, rateLimiter} from "../middlewares";
import {fetch, list, save, remove, listAll} from "../controllers/CalculatorController";

const calculatorRouter = Router();

calculatorRouter.post('/calculations', authenticate, save);
calculatorRouter.get('/calculations', authenticate, list);
calculatorRouter.get('/calculations/in-use', authenticate, fetch);
calculatorRouter.delete('/calculations/:id', authenticate, remove);
calculatorRouter.get('/calculations/all', rateLimiter, authenticate, authorize, listAll)

export default calculatorRouter;