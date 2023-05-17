import { Request, Response, NextFunction } from 'express';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      throw new Error('Credentials not valid');
    }


    res.json({ secret: token.secret });
  } catch (err) {
    next(err);
  }
}