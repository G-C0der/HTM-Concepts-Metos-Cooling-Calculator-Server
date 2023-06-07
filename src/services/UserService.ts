import jwt from "jsonwebtoken";
import {clientBaseUrl} from "../config";
import {User} from "../models";
import _path from 'path';

class UserService {
  constructor(private user: User) {}

  generateVerificationUrl = (path: string, expiresIn: string, secret?: string) => {
    if (!secret) throw new Error('Error generating URL. Secret not provided.');
    const token = jwt.sign({ id: this.user.id }, secret, { expiresIn });
    return new URL(_path.join(path, token), clientBaseUrl).toString();
  };
}

export {
  UserService
};