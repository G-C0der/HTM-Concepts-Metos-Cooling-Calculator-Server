import { Request, Response, NextFunction } from 'express';
import {serverError} from "../constants";
import {CalculatorParams} from "../models";

const save = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CalculatorParams.create({ ...req.body, userId: req.user!.id });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  save
};