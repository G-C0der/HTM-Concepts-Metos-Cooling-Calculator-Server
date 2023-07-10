import {Router} from "express";
import {list} from "../controllers/AuditLogController";
import {rateLimitedAdminMiddlewares} from "../middlewares";

const auditLogRouter = Router();

auditLogRouter.get('/audit-log', rateLimitedAdminMiddlewares, list);

export default auditLogRouter;