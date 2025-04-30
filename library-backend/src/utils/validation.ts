// src/utils/validation.ts

export interface BookInput {
  title: string;
  author: string;
  ISBN: string;
  publishedDate: string;
  genre: string;
  copiesAvailable: number;
}

interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: { field: string; message: string }[];
}

// Regular Expressions for ISBN-10 and ISBN-13
const ISBN_10_REGEX = /^(?:\d{9}[\dX])$/;  // Correct format for ISBN-10
const ISBN_13_REGEX = /^(?:\d{13})$/;  // Correct format for ISBN-13

export function validateBookInput(input: any): ValidationResult<BookInput> {
  const errors: { field: string; message: string }[] = [];

  // Trim string inputs and convert numbers
  const sanitized: BookInput = {
    title: typeof input.title === 'string' ? input.title.trim() : '',
    author: typeof input.author === 'string' ? input.author.trim() : '',
    ISBN: typeof input.ISBN === 'string' ? input.ISBN.replace(/[-\s]/g, '') : '',  // Ensure removing spaces or hyphens
    publishedDate: typeof input.publishedDate === 'string' ? input.publishedDate : '',
    genre: typeof input.genre === 'string' ? input.genre.trim() : '',
    copiesAvailable: typeof input.copiesAvailable === 'number' ? input.copiesAvailable :
      typeof input.copiesAvailable === 'string' ? parseInt(input.copiesAvailable) : NaN
  };

  // Debugging: Check sanitized ISBN and input
  console.log(`Sanitized ISBN: ${sanitized.ISBN}`);
  console.log(`Sanitized Input:`, sanitized);

  // Required fields validation
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

  // Check for valid copiesAvailable (non-negative number)
  if (isNaN(sanitized.copiesAvailable) || sanitized.copiesAvailable < 0) {
    errors.push({ field: 'copiesAvailable', message: 'Copies available must be a non-negative number' });
  }

  // Date validation (valid date format)
  if (sanitized.publishedDate) {
    const date = new Date(sanitized.publishedDate);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'publishedDate', message: 'Invalid date format. Use YYYY-MM-DD' });
    }
  }

  // Format checks for ISBN (ISBN-10 or ISBN-13)
  const isbnValid = ISBN_10_REGEX.test(sanitized.ISBN) || ISBN_13_REGEX.test(sanitized.ISBN);
  console.log(`ISBN validation: ${isbnValid}`);  // Debugging the result of ISBN validation
  if (!isbnValid) {
    errors.push({ field: 'ISBN', message: 'ISBN must be valid (ISBN-10 or ISBN-13)' });
  }

  // Logical rules
  if (new Date(sanitized.publishedDate) > new Date()) {
    errors.push({ field: 'publishedDate', message: 'Published date cannot be in the future' });
  }

  // Academic book rule (at least 5 copies for genre 'academic')
  if (sanitized.genre.toLowerCase() === 'academic' && sanitized.copiesAvailable < 5) {
    errors.push({ field: 'copiesAvailable', message: 'Academic books must have at least 5 copies available' });
  }

  // If there are any errors, return the errors
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Return valid data if no errors
  return { valid: true, data: sanitized };
}
