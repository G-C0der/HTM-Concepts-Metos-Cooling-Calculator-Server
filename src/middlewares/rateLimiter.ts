import {NextFunction, Request, Response} from "express";
import rateLimit from "express-rate-limit";

const endpointRateLimiters  = {
  '/users/verification/send': rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many email verification requests created, please try again after 10 minutes.'
  })
};

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url: endpoint } = req;

    if (!(endpoint in endpointRateLimiters)) return next();

    return endpointRateLimiters[endpoint as keyof typeof endpointRateLimiters](req, res, next);
  } catch (err) {
    console.error(`Error limiting endpoint calls. Error: ${err}`);
    next(err);
  }
};

export {
  rateLimiter
};