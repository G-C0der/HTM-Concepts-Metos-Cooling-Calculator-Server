import {NextFunction, Request, Response} from "express";
import rateLimit from "express-rate-limit";

const endpointRateLimits = {
  '/users/verification/send': {
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many email verification requests created, please try again after 10 minutes.'
  }
};

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url: endpoint } = req;

    if (!(endpoint in endpointRateLimits)) return next();

    return rateLimit(endpointRateLimits[endpoint as keyof typeof endpointRateLimits])(req, res, next);
  } catch (err) {
    console.error(`Error limiting endpoint calls. Error: ${err}`);
    next(err);
  }
};

export {
  rateLimiter
};