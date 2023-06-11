import jwt from "jsonwebtoken";
import {clientBaseUrl} from "../config";
import {User} from "../models";
import _path from 'path';
import {VerificationError} from "../errors/VerificationError";
import {ServerError} from "../errors/ServerError";

class UserService {
  generateVerificationUrl = (path: string, userId: number, expiresIn: string, secret?: string) => {
    if (!secret) throw new Error('Error generating URL. Secret not provided.');
    const token = jwt.sign({ id: userId }, secret, { expiresIn });
    return new URL(_path.join(path, token), clientBaseUrl).toString();
  };

  verifyToken = async (token: string, secret?: string, userAttributes: string[] = ['id']): Promise<User> => {
    // Verify token
    if (!secret) throw new ServerError('Error verifying token. Secret not provided.');
    let id;
    try {
      ({ id } = jwt.verify(token, secret) as jwt.JwtPayload);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new VerificationError(400, 'Your verification link has expired.');
      } else {
        throw new VerificationError(400, 'Your verification link is invalid.');
      }
    }

    // Check if user exists
    const user = await User.findOne({
      where: { id },
      attributes: userAttributes
    });
    if (!user) throw new VerificationError(400, 'No user associated with this verification link.');

    return user;
  };
}

export default new UserService();