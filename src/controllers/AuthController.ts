import { Request, Response, NextFunction } from 'express';
import {User} from "../models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {authSecret} from "../config";
import moment from "moment";
import validator from 'validator';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).send('Email is invalid.');

    // Find user with email
    const user: User | null = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send('Credentials are invalid.');

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Credentials are invalid.');

    // Verify user
    if (!user.verified) return res.status(400).send('Your user account hasn\'t been verified yet.');
    if (!user.active) return res.status(400).send('Your user account is currently inactive.');

    // Create token
    if (!authSecret) return res.status(500).send('Internal server error.');
    const token = jwt.sign({ id: user.id }, authSecret, { expiresIn: '1d' });
    const expiration = moment().add(1, 'day').valueOf();

    // Send response
    res.status(200).json({
      token,
      expiration
    });
  } catch (err) {
    res.status(500).send('Internal server error.');
    next(err);
  }
};

export {
  login
};