import {Router} from "express";
import {list} from "../controllers/AuditLogController";
import {authenticate, authorize, rateLimiter} from "../middlewares";

const auditLogRouter = Router();

auditLogRouter.get('/audit-log', rateLimiter, authenticate(), authorize, list);

export default auditLogRouter;