import {NextFunction, Request, Response} from "express";
const rateLimit = require("express-rate-limit");
import redis from 'redis';
const RedisStore = require('rate-limit-redis').default;
import {isProdEnv, redisUrl} from "../config";
import {login} from "../controllers/AuthController";

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface HttpEndpoint {
  method: HttpMethod;
  normalizedPath: string;
}

// Connect to redis client if on prod env
let redisClient: any;
(async () => {
  if (isProdEnv) {
    redisClient = redis.createClient({
      url: redisUrl
    });

    await redisClient.connect();
  }
})();

const endpointLimitMap = [
  { endpoint: 'POST:/auth', max: 10, description: 'login' },
  { endpoint: 'POST:/users', max: 10, description: 'registration' },
  { endpoint: 'POST:/users/verification', max: 3, description: 'verification email' },
  { endpoint: 'PATCH:/users/verification/:token', max: 3, description: 'verification' },
  { endpoint: 'POST:/users/password-reset', max: 3, description: 'password reset email' },
  { endpoint: 'GET:/users/password-reset/:token', max: 3, description: 'password reset' },
  { endpoint: 'PATCH:/users/password-reset/:token', max: 3, description: 'password reset' },
];

const endpointRateLimiters: any = endpointLimitMap.reduce((acc, item) => ({...acc, [item.endpoint]: rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: item.max, // Limit each IP to n requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: `Too many ${item.description} requests created, please try again in 10 minutes.`,
    ...(isProdEnv && {
      store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      })
    })
  })}));

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    const endpoint = Object.values(getEndpoint(req)).join(':');

    if (!(endpoint in endpointRateLimiters)) return endpointRateLimiters.default(req, res, next);

    return endpointRateLimiters[endpoint as keyof typeof endpointRateLimiters](req, res, next);
  } catch (err) {
    console.error(`Error limiting endpoint calls. Error: ${err}`);
    next(err);
  }
};

const getEndpoint = (req: Request): HttpEndpoint => ({
  method: (req.method as HttpMethod),
  normalizedPath: normalizePath(req)
});

const normalizePath = (req: Request): string => {
  let { path } = req;
  for (const key in req.params) {
    const value = req.params[key];
    path = path.replace(value, `:${key}`);
  }
  return path;
};

export {
  rateLimiter
};