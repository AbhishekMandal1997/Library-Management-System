"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnBook = exports.borrowBook = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBookById = exports.getAllBooks = void 0;
const Book_1 = require("../models/Book");
const validation_1 = require("../utils/validation");
const getAllBooks = async (_req, res) => {
    try {
        const books = await Book_1.Book.find().sort({ createdAt: -1 });
        res.status(200).json(books);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch books', error: err });
    }
};
exports.getAllBooks = getAllBooks;
const getBookById = async (req, res) => {
    try {
        const book = await Book_1.Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json(book);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch book', error: err });
    }
};
exports.getBookById = getBookById;
const createBook = async (req, res) => {
    try {
        const { title, author, genre, publishedDate, ISBN, copiesAvailable } = req.body;
        const validationErrors = [];
        if (!title || typeof title !== 'string') {
            validationErrors.push({ field: 'title', message: 'Title is required and must be a string' });
        }
        if (!author || typeof author !== 'string') {
            validationErrors.push({ field: 'author', message: 'Author is required and must be a string' });
        }
        if (!genre || typeof genre !== 'string') {
            validationErrors.push({ field: 'genre', message: 'Genre is required and must be a string' });
        }
        if (!publishedDate || isNaN(Date.parse(publishedDate))) {
            validationErrors.push({ field: 'publishedDate', message: 'Published date is required and must be a valid date' });
        }
        if (!ISBN || typeof ISBN !== 'string') {
            validationErrors.push({ field: 'ISBN', message: 'ISBN is required and must be a string' });
        }
        if (copiesAvailable === undefined || copiesAvailable === null || isNaN(Number(copiesAvailable))) {
            validationErrors.push({ field: 'copiesAvailable', message: 'Copies available is required and must be a number' });
        }
        if (validationErrors.length > 0) {
            res.status(400).json({ message: 'Validation failed', errors: validationErrors });
            return;
        }
        const bookData = {
            title: String(title).trim(),
            author: String(author).trim(),
            genre: String(genre).trim(),
            publishedDate: new Date(publishedDate),
            ISBN: String(ISBN).replace(/[-\s]/g, ''),
            copiesAvailable: Number(copiesAvailable)
        };
        const newBook = new Book_1.Book(bookData);
        const savedBook = await newBook.save();
        res.status(201).json({ success: true, book: savedBook });
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const validationErrors = Object.keys(err.errors).map(key => ({
                field: key,
                message: err.errors[key].message
            }));
            res.status(400).json({ message: 'Validation error', errors: validationErrors });
        }
        else if (err.code === 11000) {
            res.status(400).json({ message: 'Duplicate entry', error: 'A book with this ISBN already exists' });
        }
        else {
            res.status(500).json({ message: 'Error creating book', error: err.message });
        }
    }
};
exports.createBook = createBook;
const updateBook = async (req, res) => {
    const { valid, data, errors } = (0, validation_1.validateBookInput)(req.body);
    if (!valid) {
        res.status(400).json({ errors });
        return;
    }
    try {
        const updated = await Book_1.Book.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!updated) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json(updated);
    }
    catch (err) {
        res.status(500).json({ message: 'Book update failed', error: err });
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    try {
        const deleted = await Book_1.Book.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json({ message: 'Book deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Delete failed', error: err });
    }
};
exports.deleteBook = deleteBook;
const borrowBook = async (req, res) => {
    try {
        const book = await Book_1.Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        if (book.copiesAvailable < 1) {
            res.status(400).json({ message: 'No copies available to borrow' });
            return;
        }
        book.copiesAvailable -= 1;
        await book.save();
        res.status(200).json({ message: 'Book borrowed successfully', book });
    }
    catch (err) {
        res.status(500).json({ message: 'Borrow failed', error: err });
    }
};
exports.borrowBook = borrowBook;
const returnBook = async (req, res) => {
    try {
        const book = await Book_1.Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        book.copiesAvailable += 1;
        await book.save();
        res.status(200).json({ message: 'Book returned successfully', book });
    }
    catch (err) {
        res.status(500).json({ message: 'Return failed', error: err });
    }
};
exports.returnBook = returnBook;
//# sourceMappingURL=bookController.js.map