import {NextFunction, Request, Response} from "express";
import {serverError} from "../constants";

const authorize = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Error('Authorize middleware needs to be called after authenticate middleware.');

    if (!req.user.admin) return res.status(400).send('No permission.');

    next();
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  authorize
};