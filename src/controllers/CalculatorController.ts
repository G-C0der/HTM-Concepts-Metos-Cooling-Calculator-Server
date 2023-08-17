import { Request, Response, NextFunction } from 'express';
import {serverError} from "../constants";

const save = async (req: Request, res: Response, next: NextFunction) => {
  try {

  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  save
};