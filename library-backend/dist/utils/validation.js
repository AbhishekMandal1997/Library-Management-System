"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBookInput = validateBookInput;
const ISBN_10_REGEX = /^(?:\d{9}[\dX])$/;
const ISBN_13_REGEX = /^(?:\d{13})$/;
function validateBookInput(input) {
    const errors = [];
    const sanitized = {
        title: typeof input.title === 'string' ? input.title.trim() : '',
        author: typeof input.author === 'string' ? input.author.trim() : '',
        ISBN: typeof input.ISBN === 'string' ? input.ISBN.replace(/[-\s]/g, '') : '',
        publishedDate: typeof input.publishedDate === 'string' ? input.publishedDate : '',
        genre: typeof input.genre === 'string' ? input.genre.trim() : '',
        copiesAvailable: typeof input.copiesAvailable === 'number' ? input.copiesAvailable :
            typeof input.copiesAvailable === 'string' ? parseInt(input.copiesAvailable) : NaN
    };
    console.log(`Sanitized ISBN: ${sanitized.ISBN}`);
    console.log(`Sanitized Input:`, sanitized);
    if (!sanitized.title) {
        errors.push({ field: 'title', message: 'Title is required' });
    }
    if (!sanitized.author) {
        errors.push({ field: 'author', message: 'Author is required' });
    }
    if (!sanitized.ISBN) {
        errors.push({ field: 'ISBN', message: 'ISBN is required' });
    }
    if (!sanitized.publishedDate) {
        errors.push({ field: 'publishedDate', message: 'Published date is required' });
    }
    if (!sanitized.genre) {
        errors.push({ field: 'genre', message: 'Genre is required' });
    }
    if (isNaN(sanitized.copiesAvailable) || sanitized.copiesAvailable < 0) {
        errors.push({ field: 'copiesAvailable', message: 'Copies available must be a non-negative number' });
    }
    if (sanitized.publishedDate) {
        const date = new Date(sanitized.publishedDate);
        if (isNaN(date.getTime())) {
            errors.push({ field: 'publishedDate', message: 'Invalid date format. Use YYYY-MM-DD' });
        }
    }
    const isbnValid = ISBN_10_REGEX.test(sanitized.ISBN) || ISBN_13_REGEX.test(sanitized.ISBN);
    console.log(`ISBN validation: ${isbnValid}`);
    if (!isbnValid) {
        errors.push({ field: 'ISBN', message: 'ISBN must be valid (ISBN-10 or ISBN-13)' });
    }
    if (new Date(sanitized.publishedDate) > new Date()) {
        errors.push({ field: 'publishedDate', message: 'Published date cannot be in the future' });
    }
    if (sanitized.genre.toLowerCase() === 'academic' && sanitized.copiesAvailable < 5) {
        errors.push({ field: 'copiesAvailable', message: 'Academic books must have at least 5 copies available' });
    }
    if (errors.length > 0) {
        return { valid: false, errors };
    }
    return { valid: true, data: sanitized };
}
//# sourceMappingURL=validation.js.map