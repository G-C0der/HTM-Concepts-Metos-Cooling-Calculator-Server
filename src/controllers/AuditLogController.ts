import {NextFunction, Request, Response} from "express";
import {serverError} from "../constants";
import {AuditLog} from "../models";

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all audit logs
    const auditLogs = await AuditLog.findAll({
      order: ['created_at', 'DESC']
    });

    // Send response
    res.status(200).json({
      auditLogs
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  list
};