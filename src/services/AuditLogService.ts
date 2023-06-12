import {AuditLog} from "../models";

type CreateAction = 'registration';
type UpdateAction = 'verification' | 'passwordReset' | 'profileUpdate';
type Action = CreateAction | UpdateAction;

class AuditLogService {
  log = async (
    action: Action,
    operator: number,
    user: number,
    before: object,
    after: object
  ) => await AuditLog.create({
    action,
    operator,
    user,
    before,
    after
  });

  getLastLog = async (action: Action, user: number): Promise<AuditLog | undefined> => {
    const lastLog = await AuditLog.findOne({
      where: { user, action },
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