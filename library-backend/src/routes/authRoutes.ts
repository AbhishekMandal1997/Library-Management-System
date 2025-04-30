import express, { Router } from 'express';
import { register, login } from '../controllers/authController'; // Importing the functions

const router: Router = express.Router();

// 🔐 User Registration
router.post('/register', register);

// 🔑 User Login
router.post('/login', login);

export default router;
