import {NextFunction, Request, Response} from "express";
import {User} from "../models/User";
import bcrypt from "bcrypt";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (user) return res.status(400).send('A user with the specified email already exists.');

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const { dataValues: { password: pw, ...newUser } } = await User.create({
      email,
      password: hash
    });

    // Send user back without password
    res.status(200).json(true);
  } catch (err) {
    res.status(500).send('Internal server error.');
    next(err);
  }
};

export {
  register
};