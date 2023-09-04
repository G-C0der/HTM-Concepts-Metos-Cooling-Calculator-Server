import {NextFunction, Request, Response} from "express";
import {serverError} from "../constants";
import {AuditLog, CalculatorParams, User} from "../models";

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all audit logs
    const auditLogs = await AuditLog.findAll({
      include: [
        {
          model: User,
          as: 'operator',
          attributes: ['email']
        },
        {
          model: User,
          as: 'user',
          attributes: ['email']
        },
        {
          model: CalculatorParams,
          as: 'params',
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
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