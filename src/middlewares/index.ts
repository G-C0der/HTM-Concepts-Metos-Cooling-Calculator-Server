import {authenticate} from "./authenticate";
import {authorize} from "./authorize";
import {rateLimiter} from "./rateLimiter";

const authMiddlewares = [authenticate()];
const optionalAuthMiddlewares = [authenticate(false)];
const adminMiddlewares = [...authMiddlewares, authorize];

const rateLimitedMiddlewares = [rateLimiter];

const rateLimitedAuthMiddlewares = [...rateLimitedMiddlewares, ...authMiddlewares];
const rateLimitedOptionalAuthMiddlewares = [...rateLimitedMiddlewares, ...optionalAuthMiddlewares];
const rateLimitedAdminMiddlewares = [...rateLimitedMiddlewares, ...adminMiddlewares];

export {
  authMiddlewares,
  optionalAuthMiddlewares,
  adminMiddlewares,

  rateLimitedMiddlewares,

  rateLimitedAuthMiddlewares,
  rateLimitedOptionalAuthMiddlewares,
  rateLimitedAdminMiddlewares
};