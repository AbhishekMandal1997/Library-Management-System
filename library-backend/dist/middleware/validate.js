"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBookData = void 0;
const isValidISBN = (isbn) => {
    const isbn10 = /^[0-9]{9}[0-9Xx]$/;
    const isbn13 = /^(97(8|9))?\d{9}(\d|X)$/;
    return isbn10.test(isbn) || isbn13.test(isbn);
};
const validateBookData = (req, res, next) => {
    console.log('Validating book data...');
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    const { title, author, genre, publishedDate, ISBN, copiesAvailable } = req.body;
    const errors = [];
    console.log('Extracted fields:', {
        title,
        author,
        genre,
        publishedDate,
        ISBN,
        copiesAvailable,
        copiesAvailableType: typeof copiesAvailable
    });
    if (!title || typeof title !== 'string')
        errors.push({ field: 'title', message: 'Title is required and must be a string' });
    if (!author || typeof author !== 'string')
        errors.push({ field: 'author', message: 'Author is required and must be a string' });
    if (!genre || typeof genre !== 'string')
        errors.push({ field: 'genre', message: 'Genre is required and must be a string' });
    if (!publishedDate || isNaN(Date.parse(publishedDate)))
        errors.push({ field: 'publishedDate', message: 'Published date is required and must be a valid date' });
    if (!ISBN)
        errors.push({ field: 'ISBN', message: 'ISBN is required' });
    else if (!isValidISBN(ISBN))
        errors.push({ field: 'ISBN', message: 'ISBN must be valid (ISBN-10 or ISBN-13)' });
    if (copiesAvailable === undefined || copiesAvailable === null) {
        errors.push({ field: 'copiesAvailable', message: 'Copies available is required' });
    }
    else {
        const copiesNum = Number(copiesAvailable);
        if (isNaN(copiesNum) || copiesNum < 0) {
            errors.push({ field: 'copiesAvailable', message: 'Copies available must be a non-negative number' });
        }
    }
    if (errors.length > 0) {
        console.log('Validation errors:', errors);
        res.status(400).json({ errors });
        return;
    }
    req.body.copiesAvailable = Number(copiesAvailable);
    console.log('Validation passed. Modified request body:', req.body);
    next();
};
exports.validateBookData = validateBookData;
//# sourceMappingURL=validate.js.map