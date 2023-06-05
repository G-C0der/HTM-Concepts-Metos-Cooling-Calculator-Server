import {NextFunction, Request, Response} from "express";
import {authSecret} from "../config";
import jwt from "jsonwebtoken";
import {User} from "../models";
import {serverError} from "../constants";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token
    let token = req.headers.authorization;
    if (token) token = token.substring('Bearer '.length);
    if (!token) return res.status(401).send('Unauthorized.');

    // Validate token
    if (!authSecret) throw new Error('Error verifying user. Secret not provided.');
    let id;
    try {
      ({ id } = jwt.verify(token!, authSecret) as jwt.JwtPayload);
    } catch (err) {
      return res.status(401).send('Unauthorized.');
    }

    // Validate user
    const user = await User.findOne({
      where: { id },
      attributes: ['active', 'verified', 'admin', 'email', 'fname', 'lname']
    });
    if (!user || !user.verified || !user.active) return res.status(401).send('Unauthorized');

    // Save user in request
    req.user = user!;

    next();
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  authenticate
};