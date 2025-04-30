import { Request, Response } from 'express';
import { User } from '../models/User';
import { Book } from '../models/Book';

// 📥 Borrow a book
export const borrowBook = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { bookId } = req.body;

  try {
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
      res.status(404).json({ message: 'User or book not found' });
      return;
    }

    if (book.copiesAvailable < 1) {
      res.status(400).json({ message: 'No copies available' });
      return;
    }

    const alreadyBorrowed = user.borrowedBooks.some(
      (b) => b.bookId.toString() === bookId && !b.returnDate
    );

    if (alreadyBorrowed) {
      res.status(400).json({ message: 'Book already borrowed' });
      return;
    }

    user.borrowedBooks.push({
      bookId,
      borrowDate: new Date().toISOString(),
    });

    book.copiesAvailable -= 1;

    await user.save();
    await book.save();

    res.status(200).json({ message: 'Book borrowed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error borrowing book', error: err });
  }
};

// 📤 Return a book
export const returnBook = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;
  const { bookId } = req.body;

  try {
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
      res.status(404).json({ message: 'User or book not found' });
      return;
    }

    const borrowedEntry = user.borrowedBooks.find(
      (b) => b.bookId.toString() === bookId && !b.returnDate
    );

    if (!borrowedEntry) {
      res.status(400).json({ message: 'Book not currently borrowed' });
      return;
    }

    borrowedEntry.returnDate = new Date().toISOString();
    book.copiesAvailable += 1;

    await user.save();
    await book.save();

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error returning book', error: err });
  }
};

// 👥 (Optional) Get all users - admin view
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password'); // hide passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};
