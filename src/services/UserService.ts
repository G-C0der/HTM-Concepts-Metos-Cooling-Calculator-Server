import jwt from "jsonwebtoken";
import {clientBaseUrl} from "../config";
import {User} from "../models";
import _path from 'path';
import {ServerError, VerificationError} from "../errors";
import {auditLogService, CreateActionType, UpdateActionType} from "./";
import {intersectProperties} from "../utils";

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
    invalidateIfUserChanged: boolean = false,
    userAttributes: string[] = ['id']
  ): Promise<User> => {
    // Verify token

    if (!secret) throw new ServerError('Error verifying token. Secret not provided.');
    let id, issuedAt;
    try {
      ({ id, issuedAt } = jwt.verify(token, secret) as jwt.JwtPayload);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new VerificationError(400, 'Your URL has expired.');
      } else {
        throw new VerificationError(400, 'Your URL is invalid.');
      }
    }

    // Check if user exists
    if (invalidateIfUserChanged && !userAttributes.includes('updatedAt')) userAttributes.push('updatedAt');
    const user = await User.findOne({
      where: { id },
      attributes: userAttributes
    });
    if (!user) throw new VerificationError(400, 'No user associated with this URL.');

    // Verify that user hasn't been updated since token has been issued
    if (invalidateIfUserChanged) {
      const updatedAt = new Date(user.updatedAt).getTime();
      if (updatedAt > issuedAt) throw new VerificationError(400, 'Your URL is invalid.');
    }

    return user;
  };

  create = async (
    createActionType: CreateActionType,
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
    updateActionType: UpdateActionType,
    updateData: Partial<User>,
    userId: number,
    operatorId?: number
  ) => {
    // Query old data
    const query = { where: { id: userId } };
    const user = await User.findOne(query);
    if (!user) return false;

    // Update user
    const updated = await User.update(updateData, query);

    // Log update
    if(updated) {
      const { dataValues: { password, ...oldData } } = user;
      const loggableOldData = intersectProperties(oldData, updateData);
      const { password: _, ...loggableUpdateData } = updateData;
      await auditLogService.log(updateActionType, operatorId ?? userId, userId, loggableOldData, loggableUpdateData);
    }

    return updated;
  };
}

export default new UserService();