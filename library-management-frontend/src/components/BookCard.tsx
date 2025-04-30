import React from 'react';
import { Book } from '../types/book';
import { useAuth } from '../context/AuthContext';
import { borrowBook, returnBook } from '../services/bookService';
import { toast } from 'react-hot-toast';
import BookManagement from './BookManagement';

interface BookCardProps {
    book: Book;
    onUpdate: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onUpdate }) => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleBorrow = async () => {
        if (!user) {
            toast.error('Please login to borrow books');
            return;
        }

        try {
            setIsLoading(true);
            await borrowBook(book._id!);
            toast.success('Book borrowed successfully');
            onUpdate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to borrow book');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturn = async () => {
        if (!user) {
            toast.error('Please login to return books');
            return;
        }

        try {
            setIsLoading(true);
            await returnBook(book._id!);
            toast.success('Book returned successfully');
            onUpdate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to return book');
        } finally {
            setIsLoading(false);
        }
    };

    const isBorrowed = book.borrowedBy?.some(
        borrow => borrow.userId === user?._id && !borrow.returnDate
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-1">Author: {book.author}</p>
            <p className="text-gray-600 mb-1">ISBN: {book.ISBN}</p>
            <p className="text-gray-600 mb-1">Genre: {book.genre}</p>
            <p className="text-gray-600 mb-1">Published: {new Date(book.publishedDate).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-1">Available Copies: {book.copiesAvailable}</p>

            {user && (
                <div className="mt-4">
                    {isBorrowed ? (
                        <button
                            onClick={handleReturn}
                            disabled={isLoading}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
                        >
                            {isLoading ? 'Returning...' : 'Return Book'}
                        </button>
                    ) : (
                        <button
                            onClick={handleBorrow}
                            disabled={isLoading || book.copiesAvailable <= 0}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isLoading ? 'Borrowing...' : 'Borrow Book'}
                        </button>
                    )}
                </div>
            )}

            {user?.role === 'admin' && (
                <BookManagement book={book} onUpdate={onUpdate} />
            )}
        </div>
    );
};

export default BookCard; 