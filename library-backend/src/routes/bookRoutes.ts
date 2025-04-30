import express, { Router } from 'express';
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook
} from '../controllers/bookController';
import { authenticateToken } from '../middleware/auth';
import { validateBookData } from '../middleware/validate';

const router: Router = express.Router();

// 📚 Public: Get all books & book by ID
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// 🔒 Protected: Create, Update, Delete books
router.post('/', authenticateToken, validateBookData, createBook);
router.put('/:id', authenticateToken, validateBookData, updateBook);
router.delete('/:id', authenticateToken, deleteBook);

// 🔒 Protected: Borrow and return books
router.post('/:id/borrow', authenticateToken, borrowBook);
router.post('/:id/return', authenticateToken, returnBook);

export default router;
