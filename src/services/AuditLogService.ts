import {AuditLog} from "../models";

type UserCreateAction = 'registration';
type UserUpdateAction = 'verification' | 'passwordReset' | 'profileEdit' | 'modeChange' | 'activation' | 'deactivation';
type ParamsSaveAction = 'save';
type ParamsDeleteAction = 'delete';
type UserAction = UserCreateAction | UserUpdateAction;
type ParamsAction = ParamsSaveAction | ParamsDeleteAction;
type Action = UserAction | ParamsAction;

class AuditLogService {
  log = async (
    action: Action,
    operatorId: number,
    userId: number,
    before: object,
    after: object,
    paramsId?: number
  ) => await AuditLog.create({
    action,
    operatorId,
    userId,
    paramsId,
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
  ParamsSaveAction,
  ParamsDeleteAction
};
