import {AuditLog} from "../models";

type UserCreateAction = 'registration';
type UserUpdateAction = 'verification' | 'passwordReset' | 'profileEdit' | 'activation' | 'deactivation';
type ParamsCreateAction = 'save';
type ParamsUpdateAction = 'override';
type ParamsDeleteAction = 'delete';
type UserAction = UserCreateAction | UserUpdateAction;
type ParamsAction = ParamsCreateAction | ParamsUpdateAction | ParamsDeleteAction;
type Action = UserAction | ParamsAction;

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
  UserAction,
  UserCreateAction,
  UserUpdateAction,

  ParamsAction,
  ParamsCreateAction,
  ParamsUpdateAction,
  ParamsDeleteAction
};