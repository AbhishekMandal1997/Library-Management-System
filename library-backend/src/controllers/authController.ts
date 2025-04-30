import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

// User Registration
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    // Validate password length (example: minimum length of 6)
    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const user = await User.create({ name, email, password: hashedPassword });

    // Return success message and user info (excluding password)
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    // Log and return error
    console.error(err);
    res.status(500).json({ message: 'Registration failed', error: 'Internal Server Error' });
  }
};

// User Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'default_secret', // Directly using process.env.JWT_SECRET
      { expiresIn: '7d' } // token expiration time (could be moved to .env)
    );

    // Return the token and user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // Log and return error
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: 'Internal Server Error' });
  }
};
