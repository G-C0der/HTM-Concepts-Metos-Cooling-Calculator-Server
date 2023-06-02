import {NextFunction, Request, Response} from "express";
import rateLimit from "express-rate-limit";

const min10 = 10 * 60 * 1000; // 10 minutes
const endpointRateLimiters  = {
  '/auth': rateLimit({
    windowMs: min10,
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many login requests created, please try again in 10 minutes.'
  }),
  '/users': rateLimit({
    windowMs: min10,
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many registration requests created, please try again in 10 minutes.'
  }),
  '/users/verification/send': rateLimit({
    windowMs: min10, // 10 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many verification email requests created, please try again in 10 minutes.'
  }),
  '/users/verification/:token': rateLimit({
    windowMs: min10, // 10 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many verification requests created, please try again in 10 minutes.'
  }),
  default: rateLimit({
    windowMs: min10, // 10 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many requests created, please try again in 10 minutes.'
  }),
};

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url: endpoint } = req;

    if (!(endpoint in endpointRateLimiters)) return endpointRateLimiters.default(req, res, next);

    return endpointRateLimiters[endpoint as keyof typeof endpointRateLimiters](req, res, next);
  } catch (err) {
    console.error(`Error limiting endpoint calls. Error: ${err}`);
    next(err);
  }
};

export {
  rateLimiter
};