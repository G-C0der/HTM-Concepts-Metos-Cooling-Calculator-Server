import {NextFunction, Request, Response} from "express";
import {User} from "../models/User";
import bcrypt from "bcrypt";
import * as yup from 'yup';
import {escapeForRegExp} from "../utils";
import mailer from "../services/Mailer";

const serverError = 'Internal server error.';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, tnc, ...otherFields } = req.body;

    // Check if Terms and Conditions accepted
    if (!tnc) return res.status(400).send('You must accept the Terms and Conditions.');

    // Validate email and password
    const passwordSpecialCharacters = '*.!@#$%^&(){}[\]:;<>,.?\/~_+\-=|\\';
    const passwordSpecialCharactersDoubleEscaped = escapeForRegExp(passwordSpecialCharacters);

    const validationSchema = yup.object({
      email: yup
        .string()
        .required('Email is required')
        .email('Email is invalid'),
      password: yup
        .string()
        .required('Password is required')
        .matches(new RegExp(`^[a-zA-Z0-9${passwordSpecialCharactersDoubleEscaped}]+$`),
          `Password can only contain Latin letters, numbers, and following special characters: ${passwordSpecialCharacters}.`)
        .min(8, 'Password is too short - should be minimum 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]+/, 'Password must contain at least one digit.')
        .matches(new RegExp(`[${passwordSpecialCharactersDoubleEscaped}]+`),
          'Password must contain at least one special character.')
    });

    try {
      await validationSchema.validate({ email, password }, { abortEarly: false });
    } catch (err: any) {
      return res.status(400).send(err.errors[0]);
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (user) return res.status(400).send('A user with the specified email already exists.');

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const { dataValues: { password: pw, ...newUser } } = await User.create({
      email,
      password: hash,
      ...otherFields
    });

    // Send verification email
    const { accepted, messageId } = await mailer.sendVerificationPendingEmail(email);

    // Send response
    res.status(200).json({
      wasVerificationEmailSent: ((accepted && accepted[0] === email) && messageId)
    });
  } catch (err) {
    res.status(500).send(serverError);
    next(err);
  }
};

const sendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Send verification email
    const { accepted, messageId } = await mailer.sendVerificationPendingEmail(email);

    // Send response
    res.status(200).json({
      wasVerificationEmailSent: ((accepted && accepted[0] === email) && messageId)
    });
  } catch (err) {
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  register,
  sendVerificationEmail
};