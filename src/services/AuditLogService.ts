import {AuditLog} from "../models";

type CreateAction = 'registration';
type UpdateAction = 'verification' | 'passwordReset' | 'activation' | 'deactivation';
type Action = CreateAction | UpdateAction;

class AuditLogService {
  log = async (
    action: Action,
    operatorId: number,
    userId: number,
    before: object,
    after: object
  ) => await AuditLog.create({
    action,
    operatorId,
    userId,
    before,
    after
  });

  getLastLog = async (action: Action, userId: number): Promise<AuditLog | undefined> => {
    const lastLog = await AuditLog.findOne({
      where: { userId, action },
      order: [['createdAt', 'DESC']]
    });

    return lastLog?.dataValues;
  };
}

export default new AuditLogService();

export type {
  Action,
  CreateAction,
  UpdateAction
};