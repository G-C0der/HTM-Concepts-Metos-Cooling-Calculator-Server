import {NextFunction, Request, Response} from "express";
const rateLimit = require("express-rate-limit");
import { createClient } from '@redis/client'
const RedisStore = require('rate-limit-redis').default;
import {isProdEnv, redisUrl} from "../config";
import {login} from "../controllers/AuthController";
import {ServerError} from "../errors";

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface HttpEndpoint {
  method: HttpMethod;
  normalizedPath: string;
}

const endpointLimits = [
  { endpoint: 'POST:/auth', max: 10, keyword: 'login' },
  { endpoint: 'POST:/users', max: 10, keyword: 'registration' },
  { endpoint: 'POST:/users/verification', max: 3, keyword: 'verification email' },
  { endpoint: 'PATCH:/users/verification/:token', max: 3, keyword: 'verification' },
  { endpoint: 'POST:/users/password-reset', max: 3, keyword: 'password reset email' },
  { endpoint: 'GET:/users/password-reset/:token', max: 3, keyword: 'password reset' },
  { endpoint: 'PATCH:/users/password-reset/:token', max: 3, keyword: 'password reset' },
  { endpoint: 'GET:/users', max: 10, keyword: 'user list' },
  { endpoint: 'PATCH:/users/:id', max: 3, keyword: 'active state change' },
];

let redisClient: any, endpointRateLimiters: any;
(async () => {
  // Connect to redis client if on prod env
  // if (isProdEnv) {
  //   redisClient = createClient({
  //     url: redisUrl
  //   });
  //
  //   redisClient.on('error', (err: any) => {
  //     console.error('Error occurred with Redis client: ', err);
  //   });
  //
  //   await redisClient.connect();
  // }

  // Set up rate limiters for each endpoint specified in endpointLimits
  endpointRateLimiters = endpointLimits.reduce((acc, { endpoint, max, keyword }) =>
    ({...acc, [endpoint]: rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max, // Limit each IP to n requests per windowMs
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message: `Too many ${keyword} requests created, please try again in ${isProdEnv ? 3 : 10} minutes.`, // Heroku dynos change every few minutes, resetting the limiter each time
      // keyGenerator: () => endpoint, // TODO: For this to work correctly on Heroku, an ID saved in a cookie needs to be added to the key so the user can be identified
      // ...(isProdEnv && {
      //   store: new RedisStore({
      //     sendCommand: (...args: string[]) => redisClient.sendCommand(args)
      //   })
      // })
    })}), {});
})();

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  try {
    const endpoint = getEndpointAsKey(req);

    if (!(endpoint in endpointRateLimiters)) {
      throw new ServerError(`Rate limiting requested but not specified for endpoint "${endpoint}".`);
    }

    return endpointRateLimiters[endpoint as keyof typeof endpointRateLimiters](req, res, next);
  } catch (err) {
    console.error(`Error limiting endpoint calls. Error: ${err}`);
    next(err);
  }
};

const getEndpointAsKey = (req: Request) => Object.values(getEndpoint(req)).join(':');

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