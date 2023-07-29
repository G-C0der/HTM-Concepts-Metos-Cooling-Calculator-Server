import {NextFunction, Request, Response} from "express";
import {User} from "../models";
import bcrypt from "bcrypt";
import * as yup from 'yup';
import {mailer, userService} from "../services";
import validator from 'validator';
import {htmConceptsEmail, passwordResetSecret, verificationSecret} from "../config";
import {
  serverError,
  emailValidationSchema,
  passwordValidationSchema,
  userAlreadyVerifiedError, editableUserFields
} from "../constants";
import {VerificationError} from "../errors";
import {toEditableUserFields} from "../utils";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { email, password, ...otherFields } = req.body;

    // Only use allowed user fields
    otherFields = toEditableUserFields(otherFields);

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

    // Check if user exists
    const user = await User.findOne({
      where: { email },
      attributes: ['id']
    });
    if (user) return res.status(400).send('A user with the specified email already exists.');

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await userService.create('registration', {
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
    const wasEmailSent = await mailer.sendVerificationPendingEmail(email, verificationUrl);

    // Send response
    res.status(200).json({
      wasEmailSent
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
    if (user.verified) return res.status(400).json({
      message: userAlreadyVerifiedError,
      severity: 'warning'
    });

    // Create verification URL
    const verificationUrl = userService.generateVerificationUrl(
      '/verification',
      user.id,
      '1d',
      verificationSecret
    );

    // Send verification pending email
    const wasEmailSent = await mailer.sendVerificationPendingEmail(email, verificationUrl);

    // Send response
    res.status(200).json({
      wasEmailSent
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
      user = await userService.verifyToken(token, verificationSecret, undefined, ['id', 'email', 'verified']);
    } catch (err: any) {
      if (err instanceof VerificationError) return res.status(err.code).send(err.message);
      throw err;
    }

    // Check if user already verified
    if (user!.verified) return res.status(400).json({
      message: userAlreadyVerifiedError,
      severity: 'warning'
    });

    // Set user verified
    const wasVerified = await userService.update('verification', { verified: true }, user.id);
    if (!wasVerified) {
      return res.status(500).send('Unexpected error during user verification. Please try again later.');
    }

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

    // Send reset password pending email
    const wasEmailSent = await mailer.sendPasswordResetPendingEmail(email, passwordResetUrl);

    // Send response
    res.status(200).json({
      wasEmailSent
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
      await userService.verifyToken(token, passwordResetSecret, 'passwordReset');
    } catch (err: any) {
      if (err instanceof VerificationError) return res.status(err.code).send(err.message);
      throw err;
    }

    // Send response
    res.status(200).send('Password reset succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { token }, body: { password }, user } = req;

    // Validate token
    // Either user has already been authenticated or password reset token is required
    let id;
    if (token) {
      try {
        ({ id } = await userService.verifyToken(token, passwordResetSecret, 'passwordReset'));
      } catch (err: any) {
        if (err instanceof VerificationError) return res.status(err.code).send(err.message);
        throw err;
      }
    }
    else ({ id } = user!);

    // Validate password
    const validationSchema = yup.object({
      password: passwordValidationSchema
    });
    try {
      await validationSchema.validate({ password }, { abortEarly: false });
    } catch (err: any) {
      return res.status(400).send(err.errors[0]);
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Set user password
    const wasPasswordReset = await userService.update('passwordReset', { password: hash }, id);
    if (!wasPasswordReset) return res.status(500).send('Unexpected error during password reset. Please try again later.');

    // Send response
    res.status(200).send('Password reset succeeded.');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const fetchForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req;

    // Get user form fields
    const form = await User.findByPk(user!.id, {
      attributes: editableUserFields
    });
    if (!form) return res.status(500).send('Unexpected error during profile data loading. Please try again later.');

    // Send response
    res.status(200).json({
      form
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
}

const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { params: { id }, body: userFields, user } = req;

    // Only use allowed user fields
    userFields = toEditableUserFields(userFields);

    // Update profile
    const userId = id ? +id : user!.id;
    const wasProfileEdited = await userService.update('profileEdit', userFields, userId, user!.id);
    if (!wasProfileEdited) return res.status(500).send('Unexpected error during profile edit. Please try again later.');

    // Send response
    res.status(200).send('Profile edit succeeded');
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all users
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [
        ['company', 'ASC'],
        ['fname', 'ASC'],
        ['lname', 'ASC']
      ]
    });

    // Send response
    res.status(200).json({
      users
    });
  } catch (err) {
    console.error(`${serverError} Error: ${err}`);
    res.status(500).send(serverError);
    next(err);
  }
};

const changeActiveState = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { params: { id }, user: admin, body: { active } } = req;

    // Get user
    const user = await User.findByPk(id);
    if (!user) return res.status(400).send('User doesn\'t exist.');

    // Change user active state
    const wasActiveStateChanged = userService.update(
      active ? 'activation' : 'deactivation',
      { active },
      +id,
      admin!.id
    );
    if (!wasActiveStateChanged) {
      return res.status(500).send('Unexpected error during user active state change. Please try again later.');
    }

    // Send activation done email if user was activated
    let wasEmailSent;
    if (active) wasEmailSent = await mailer.sendActivationDoneEmail(user.email);

    res.status(200).json({
      wasEmailSent
    });
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
  resetPassword,
  fetchForm,
  editProfile,
  list,
  changeActiveState
};