import {NextFunction, Request, Response} from "express";
import {User} from "../models";
import bcrypt from "bcrypt";
import * as yup from 'yup';
import {escapeForRegExp} from "../utils";
import {mailer, userService} from "../services";
import validator from 'validator';
import {htmConceptsEmail, passwordResetSecret, verificationSecret} from "../config";
import {serverError} from "../constants";
import {VerificationError} from "../errors/VerificationError";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, tnc, ...otherFields } = req.body;

    // Check if Terms and Conditions accepted
    if (!tnc) return res.status(400).send('You must accept the Terms and Conditions.');

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).send('Email is invalid.');

    // Validate email and password
    const passwordSpecialCharacters = '*.!@#$%^&(){}[\]:;<>,.?\/~_+\-=|\\';
    const passwordSpecialCharactersDoubleEscaped = escapeForRegExp(passwordSpecialCharacters);

    const validationSchema = yup.object({
      email: yup
        .string()
        .required('Email is required.')
        .email('Email is invalid.'),
      password: yup
        .string()
        .required('Password is required.')
        .matches(new RegExp(`^[a-zA-Z0-9${passwordSpecialCharactersDoubleEscaped}]+$`),
          `Password can only contain Latin letters, numbers, and following special characters: ${passwordSpecialCharacters}.`)
        .min(8, 'Password is too short - should be minimum 8 characters.')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter.')
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
    const user = await User.findOne({
      where: { email },
      attributes: ['id']
    });
    if (user) return res.status(400).send('A user with the specified email already exists.');

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const { dataValues: { password: pw, ...newUser } } = await User.create({
      email,
      password: hash,
      ...otherFields
    });

    // Create verification URL
    const verificationUrl = userService.generateVerificationUrl(
      '/verification',
      newUser.id,
      '1d',
      verificationSecret
    );

    // Send verification pending email
    const { accepted, messageId } = await mailer.sendVerificationPendingEmail(email, verificationUrl);

    // Send response
    res.status(200).json({
      wasEmailSent: ((accepted && accepted[0] === email) && !!messageId)
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const sendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).send('Email is invalid.');

    // Check if user exists
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'verified']
    });
    if (!user) return res.status(400).send('A user with the specified email doesn\'t exist.');
    if (user.verified) return res.status(400).send('User Account has already been verified.');

    // Create verification URL
    const verificationUrl = userService.generateVerificationUrl(
      '/verification',
      user.id,
      '1d',
      verificationSecret
    );

    // Send verification pending email
    const { accepted, messageId } = await mailer.sendVerificationPendingEmail(email, verificationUrl);

    // Send response
    res.status(200).json({
      wasEmailSent: ((accepted && accepted[0] === email) && !!messageId)
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    // Validate token
    let user;
    try {
      user = await userService.verifyToken(token, verificationSecret, ['id', 'email', 'verified']);
    } catch (err: any) {
      if (err instanceof VerificationError) return res.status(err.code).send(err.message);
      throw err;
    }

    if (user!.verified) return res.status(400).send('User Account has already been verified.');

    // Set user verified
    const updated = await User.update(
      { verified: true },
      { where: { id: user.id } }
    );
    if (!updated) return res.status(500).send('Unexpected error during verification. Please try again later.');

    // Send verification done email
    mailer.sendVerificationDoneEmail(htmConceptsEmail, user.email);

    // Send activation pending email
    mailer.sendActivationPendingEmail(user.email);

    // Send response
    res.status(200).send('User verification succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const sendResetPasswordEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validator.isEmail(email)) return res.status(400).send('Email is invalid.');

    // Check if user exists
    const user = await User.findOne({
      where: { email },
      attributes: ['id']
    });
    if (!user) return res.status(400).send('A user with the specified email doesn\'t exist.');

    // Create reset password URL
    const passwordResetUrl = userService.generateVerificationUrl(
      '/reset-password',
      user.id,
      '1h',
      passwordResetSecret
    );

    // Send verification pending email
    const { accepted, messageId } = await mailer.sendPasswordResetPendingEmail(email, passwordResetUrl);

    // Send response
    res.status(200).json({
      wasEmailSent: ((accepted && accepted[0] === email) && !!messageId)
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const verifyResetPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;

    // Validate token
    try {
      await userService.verifyToken(token, passwordResetSecret);
    } catch (err: any) {
      if (err instanceof VerificationError) return res.status(err.code).send(err.message);
      throw err;
    }

    // Send response
    res.status(200).send('Password reset user verification succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate token
    let id;
    try {
      ({ id } = await userService.verifyToken(token, passwordResetSecret));
    } catch (err: any) {
      if (err instanceof VerificationError) return res.status(err.code).send(err.message);
      throw err;
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Set user password
    const updated = await User.update(
      { password: hash },
      { where: { id } }
    );
    if (!updated) return res.status(500).send('Unexpected error during password reset. Please try again later.');

    // Send response
    res.status(200).send('Password reset succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

export {
  register,
  sendVerificationEmail,
  verify,
  sendResetPasswordEmail,
  verifyResetPasswordToken,
  resetPassword
};