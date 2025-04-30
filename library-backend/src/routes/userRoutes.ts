import express, { Router } from 'express';
import { borrowBook, returnBook, getAllUsers } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// 🔁 Borrow a book
router.post('/:id/borrow', authenticateToken, borrowBook);

// 🔁 Return a book
router.post('/:id/return', authenticateToken, returnBook);

// 👥 Optional: View all users (for admin use)
router.get('/', authenticateToken, getAllUsers);

export default router;
