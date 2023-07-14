import jwt from "jsonwebtoken";
import {clientBaseUrl} from "../config";
import {User} from "../models";
import _path from 'path';
import {ServerError, VerificationError} from "../errors";
import {Action, auditLogService, CreateAction, UpdateAction} from "./";
import {getChangedProperties} from "../utils";
import {urlExpiredError, urlInvalidError, urlNoUserAssociatedError} from "../constants";

class UserService {
  generateVerificationUrl = (
    path: string,
    userId: number,
    expiresIn: string,
    secret?: string
  ) => {
    if (!secret) throw new ServerError('Error generating URL. Secret not provided.');
    const token = jwt.sign({ id: userId, issuedAt: Date.now() }, secret, { expiresIn });
    return new URL(_path.join(path, token), clientBaseUrl).toString();
  };

  verifyToken = async (
    token: string,
    secret?: string,
    invalidationAction?: Action,
    userAttributes: string[] = ['id']
  ): Promise<User> => {
    // Verify token

    if (!secret) throw new ServerError('Error verifying token. Secret not provided.');
    let id, issuedAt;
    try {
      ({ id, issuedAt } = jwt.verify(token, secret) as jwt.JwtPayload);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new VerificationError(400, urlExpiredError);
      } else {
        throw new VerificationError(400, urlInvalidError);
      }
    }

    // Check if user exists
    if (invalidationAction && !userAttributes.includes('id')) userAttributes.push('id');
    const user = await User.findOne({
      where: { id },
      attributes: userAttributes
    });
    if (!user) throw new VerificationError(400, urlNoUserAssociatedError);

    // Verify that user hasn't done a specific action since token has been issued
    invalidationActionIf: if (invalidationAction) {
      const lastPasswordResetLog = await auditLogService.getLastLog(invalidationAction, user.id);
      if (!lastPasswordResetLog) break invalidationActionIf;
      const lastPasswordResetLogCreatedAt = new Date(lastPasswordResetLog.createdAt).getTime();
      if (lastPasswordResetLogCreatedAt > issuedAt) throw new VerificationError(400, urlInvalidError);
    }

    return user;
  };

  create = async (
    createActionType: CreateAction,
    createData: Partial<User>,
    operatorId?: number
  ) => {
    // Create user
    const { dataValues: { password: _, ...newUser } } = await User.create(createData);

    // Log creation
    await auditLogService.log(createActionType, operatorId ?? newUser.id, newUser.id, {}, newUser);

    return newUser;
  };

  update = async (
    updateActionType: UpdateAction,
    updateData: Partial<User>,
    userId: number,
    operatorId?: number
  ) => {
    // Query old data
    const query = { where: { id: userId } };
    const user = await User.findOne(query);
    if (!user) return false;
    const { dataValues: { password, ...oldData } } = user;

    // Update user
    for (const [fieldKey, fieldVal] of Object.entries(updateData)) {
      (user as any)[fieldKey] = fieldVal;
    }
    const updatedUser = await user.save();

    // Prepare loggable before and after data
    const { dataValues: { password: _, ...newData } } = updatedUser;
    const { oldData: loggableOldData, newData: loggableNewData } = getChangedProperties<Partial<User>>(oldData, newData);

    // Log update
    const wasUserUpdated = !!Object.keys(loggableNewData).length;
    if(wasUserUpdated) {
      await auditLogService.log(updateActionType, operatorId ?? userId, userId, loggableOldData, loggableNewData);
    }

    return wasUserUpdated;
  };
}

export default new UserService();