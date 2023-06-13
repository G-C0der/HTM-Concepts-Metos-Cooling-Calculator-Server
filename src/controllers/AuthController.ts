import { Request, Response, NextFunction } from 'express';
import {User} from "../models";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {authSecret} from "../config";
import moment from "moment";
import validator from 'validator';
import {emailValidationSchema, passwordValidationSchema, serverError} from "../constants";
import * as yup from 'yup';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).send('Email is invalid.');

    // Validate email and password
    const validationSchema = yup.object({
      email: emailValidationSchema,
      password: passwordValidationSchema
    });
    try {
      await validationSchema.validate({ email, password }, { abortEarly: false });
    } catch (err: any) {
      return res.status(400).send(err.errors[0]);
    }

    // Find user with email
    const user: User | null = await User.findOne({
      where: { email },
      attributes: ['id', 'password', 'verified', 'active', 'admin', 'email', 'fname', 'lname']
    });
    if (!user) return res.status(400).send('Credentials are invalid.');

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Credentials are invalid.');

    // Verify user
    if (!user.verified) return res.status(400).send('Your user account hasn\'t been verified yet.');
    if (!user.active) return res.status(400).send('Your user account is currently inactive.');

    // Create token
    if (!authSecret) throw new Error('Error logging in user. Secret not provided.');
    const token = jwt.sign({ id: user.id }, authSecret, { expiresIn: '1d' });
    const expiration = moment().add(1, 'day').valueOf();

    // Prepare user object for client
    const { dataValues: { id, password: _, verified, active, ...userData } } = user;

    // Send response
    res.status(200).json({
      token,
      expiration,
      user: userData
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const getAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({
      user: req.user
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  login,
  getAuthenticatedUser
};