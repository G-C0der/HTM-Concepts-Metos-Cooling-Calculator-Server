import { Request, Response, NextFunction } from 'express';
import {User} from "../models/User";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {secret} from "../config";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // Find user with email
    const user: User | null = await User.findOne({ where: { email } });
    if (!user) return res.status(400).send('No user found with specified email.');

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Password incorrect.')

    // Create token
    if (!secret) return res.status(500).send('Secret needs to be specified.');
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1d' });

    // Send response
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send('Internal server error.');
    next(err);
  }
};

export {
  login
};