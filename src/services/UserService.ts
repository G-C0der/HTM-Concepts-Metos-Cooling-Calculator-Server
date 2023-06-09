import jwt from "jsonwebtoken";
import {clientBaseUrl} from "../config";
import {User} from "../models";
import _path from 'path';
import {VerificationError} from "../errors/VerificationError";
import {ServerError} from "../errors/ServerError";

class UserService {
  generateVerificationUrl = (path: string, userId: number, expiresIn: string, secret?: string) => {
    if (!secret) throw new ServerError(500, 'Error generating URL. Secret not provided.');
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
    if (!secret) throw new ServerError(500, 'Error verifying token. Secret not provided.');
    let id, issuedAt;
    try {
      ({ id, issuedAt } = jwt.verify(token, secret) as jwt.JwtPayload);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new VerificationError(400, 'Your verification URL has expired.');
      } else {
        throw new VerificationError(400, 'Your verification URL is invalid.');
      }
    }

    // Check if user exists
    if (invalidateIfUserChanged && !userAttributes.includes('updatedAt')) userAttributes.push('updatedAt');
    const user = await User.findOne({
      where: { id },
      attributes: userAttributes
    });
    if (!user) throw new VerificationError(400, 'No user associated with this verification URL.');
    if (invalidateIfUserChanged) {
      const updatedAt = new Date(user.updatedAt).getTime();
      if (updatedAt > issuedAt) throw new VerificationError(400, 'Your verification URL is invalid.');
    }

    return user;
  };
}

export default new UserService();