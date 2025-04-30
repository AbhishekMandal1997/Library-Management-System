"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.returnBook = exports.borrowBook = void 0;
const User_1 = require("../models/User");
const Book_1 = require("../models/Book");
const borrowBook = async (req, res) => {
    const userId = req.params.id;
    const { bookId } = req.body;
    try {
        const user = await User_1.User.findById(userId);
        const book = await Book_1.Book.findById(bookId);
        if (!user || !book) {
            res.status(404).json({ message: 'User or book not found' });
            return;
        }
        if (book.copiesAvailable < 1) {
            res.status(400).json({ message: 'No copies available' });
            return;
        }
        const alreadyBorrowed = user.borrowedBooks.some((b) => b.bookId.toString() === bookId && !b.returnDate);
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
    }
    catch (err) {
        res.status(500).json({ message: 'Error borrowing book', error: err });
    }
};
exports.borrowBook = borrowBook;
const returnBook = async (req, res) => {
    const userId = req.params.id;
    const { bookId } = req.body;
    try {
        const user = await User_1.User.findById(userId);
        const book = await Book_1.Book.findById(bookId);
        if (!user || !book) {
            res.status(404).json({ message: 'User or book not found' });
            return;
        }
        const borrowedEntry = user.borrowedBooks.find((b) => b.bookId.toString() === bookId && !b.returnDate);
        if (!borrowedEntry) {
            res.status(400).json({ message: 'Book not currently borrowed' });
            return;
        }
        borrowedEntry.returnDate = new Date().toISOString();
        book.copiesAvailable += 1;
        await user.save();
        await book.save();
        res.status(200).json({ message: 'Book returned successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error returning book', error: err });
    }
};
exports.returnBook = returnBook;
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.User.find().select('-password');
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=userController.js.map