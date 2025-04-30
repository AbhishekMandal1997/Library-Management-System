import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface DecodedUser extends JwtPayload {
  userId: string;
  role: string;
}

interface CustomRequest extends Request {
  user?: DecodedUser;
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    if (typeof decoded === 'object' && 'userId' in decoded && 'role' in decoded) {
      req.user = decoded as DecodedUser;
      next();
    } else {
      res.status(403).json({ message: 'Invalid token structure' });
    }
  } catch (err) {
    res.status(403).json({ message: 'Token is not valid' });
  }
};

export { authenticateToken, CustomRequest };
