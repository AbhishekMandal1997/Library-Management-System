import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book } from '../types/book';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook, borrowBook, returnBook } from '../services/bookService';

interface BookContextType {
    books: Book[];
    loading: boolean;
    error: string | null;
    fetchBooks: () => Promise<void>;
    getBook: (id: string) => Promise<Book>;
    addBook: (book: Omit<Book, '_id'>) => Promise<void>;
    editBook: (id: string, book: Partial<Book>) => Promise<void>;
    removeBook: (id: string) => Promise<void>;
    borrow: (bookId: string) => Promise<void>;
    returnBook: (bookId: string) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await getAllBooks();
            setBooks(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch books');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getBook = async (id: string) => {
        try {
            setLoading(true);
            const book = await getBookById(id);
            setError(null);
            return book;
        } catch (err) {
            setError('Failed to fetch book');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addBook = async (book: Omit<Book, '_id'>) => {
        try {
            setLoading(true);
            const newBook = await createBook(book);
            setBooks(prev => [...prev, newBook]);
            setError(null);
        } catch (err) {
            setError('Failed to add book');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const editBook = async (id: string, book: Partial<Book>) => {
        try {
            setLoading(true);
            const updatedBook = await updateBook(id, book);
            setBooks(prev => prev.map(b => b._id === id ? updatedBook : b));
            setError(null);
        } catch (err) {
            setError('Failed to update book');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeBook = async (id: string) => {
        try {
            setLoading(true);
            await deleteBook(id);
            setBooks(prev => prev.filter(b => b._id !== id));
            setError(null);
        } catch (err) {
            setError('Failed to delete book');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const borrow = async (bookId: string) => {
        try {
            setLoading(true);
            await borrowBook(bookId);
            await fetchBooks();
            setError(null);
        } catch (err) {
            setError('Failed to borrow book');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const returnBookHandler = async (bookId: string) => {
        try {
            setLoading(true);
            await returnBook(bookId);
            await fetchBooks();
            setError(null);
        } catch (err) {
            setError('Failed to return book');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <BookContext.Provider value={{
            books,
            loading,
            error,
            fetchBooks,
            getBook,
            addBook,
            editBook,
            removeBook,
            borrow,
            returnBook: returnBookHandler
        }}>
            {children}
        </BookContext.Provider>
    );
};

export const useBook = () => {
    const context = useContext(BookContext);
    if (context === undefined) {
        throw new Error('useBook must be used within a BookProvider');
    }
    return context;
}; 