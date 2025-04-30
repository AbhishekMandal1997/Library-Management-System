import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Book } from '../types/book';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook, borrowBook, returnBook } from '../services/bookService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const handleError = useCallback((error: any, defaultMessage: string) => {
        console.error('Error:', error);
        const errorMessage = error.response?.data?.message || defaultMessage;
        setError(errorMessage);
        toast.error(errorMessage);

        // Handle authentication errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
        }

        throw error;
    }, [navigate]);

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('BookContext: Fetching books...');
            const data = await getAllBooks();
            console.log('BookContext: Received books:', data);
            if (Array.isArray(data)) {
                setBooks(data);
            } else {
                console.error('BookContext: Received non-array data:', data);
                throw new Error('Invalid data format received from server');
            }
        } catch (err: any) {
            handleError(err, 'Failed to fetch books');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const getBook = useCallback(async (id: string) => {
        try {
            setLoading(true);
            const book = await getBookById(id);
            setError(null);
            return book;
        } catch (err: any) {
            handleError(err, 'Failed to fetch book');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const addBook = useCallback(async (book: Omit<Book, '_id'>) => {
        try {
            setLoading(true);
            setError(null);
            const newBook = await createBook(book);
            setBooks(prev => [...prev, newBook]);
            toast.success('Book added successfully');
            navigate('/books');
        } catch (err: any) {
            handleError(err, 'Failed to add book');
        } finally {
            setLoading(false);
        }
    }, [handleError, navigate]);

    const editBook = useCallback(async (id: string, book: Partial<Book>) => {
        try {
            setLoading(true);
            setError(null);
            const updatedBook = await updateBook(id, book);
            setBooks(prev => prev.map(b => b._id === id ? updatedBook : b));
            toast.success('Book updated successfully');
            navigate('/books');
        } catch (err: any) {
            handleError(err, 'Failed to update book');
        } finally {
            setLoading(false);
        }
    }, [handleError, navigate]);

    const removeBook = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await deleteBook(id);
            setBooks(prev => prev.filter(b => b._id !== id));
            toast.success('Book deleted successfully');
        } catch (err: any) {
            handleError(err, 'Failed to delete book');
        } finally {
            setLoading(false);
        }
    }, [handleError]);

    const borrow = useCallback(async (bookId: string) => {
        try {
            setLoading(true);
            setError(null);
            await borrowBook(bookId);
            await fetchBooks(); // Refresh the book list
            toast.success('Book borrowed successfully');
        } catch (err: any) {
            handleError(err, 'Failed to borrow book');
        } finally {
            setLoading(false);
        }
    }, [fetchBooks, handleError]);

    const returnBookHandler = useCallback(async (bookId: string) => {
        try {
            setLoading(true);
            setError(null);
            await returnBook(bookId);
            await fetchBooks(); // Refresh the book list
            toast.success('Book returned successfully');
        } catch (err: any) {
            handleError(err, 'Failed to return book');
        } finally {
            setLoading(false);
        }
    }, [fetchBooks, handleError]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const contextValue = useMemo(() => ({
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
    }), [
        books,
        loading,
        error,
        fetchBooks,
        getBook,
        addBook,
        editBook,
        removeBook,
        borrow,
        returnBookHandler
    ]);

    return (
        <BookContext.Provider value={contextValue}>
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