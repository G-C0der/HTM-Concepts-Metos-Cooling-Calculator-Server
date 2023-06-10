import {AuditLog} from "../models";

type CreateActionType = 'registration';
type UpdateActionType = 'verification' | 'passwordReset' | 'profileUpdate';
type ActionType = CreateActionType | UpdateActionType;

class AuditLogService {
  log = async (
    action: ActionType,
    operator: number,
    before: object,
    after: object
  ) => await AuditLog.create({
    action,
    operator,
    before,
    after
  });
}

export default new AuditLogService();

export type {
  ActionType,
  CreateActionType,
  UpdateActionType
};