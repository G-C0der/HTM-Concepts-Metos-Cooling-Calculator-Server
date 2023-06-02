import jwt from "jsonwebtoken";
import {clientBaseUrl, verificationSecret} from "../config";
import {User} from "../models/User";

class UserService {
  constructor(private user: User) {}

  generateVerificationUrl = () => {
    if (!verificationSecret) throw new Error('Error generating verification URL. Error: verification secret ' +
      'not provided');
    const token = jwt.sign({ id: this.user.id }, verificationSecret, { expiresIn: '1d' });
    return new URL(`/verify/${token}`, clientBaseUrl).toString();
  };
}

export {
  UserService
};