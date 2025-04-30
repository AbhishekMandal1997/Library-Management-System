import React from 'react';
import { getAllBooks } from '../services/bookService';
import BookCard from './BookCard';
import AddBook from './AddBook';
import { Book } from '../types/book';
import { useAuth } from '../context/AuthContext';

const BookList: React.FC = () => {
    const [books, setBooks] = React.useState<Book[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const { user } = useAuth();

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

    React.useEffect(() => {
        fetchBooks();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Available Books</h2>
                {user?.role === 'admin' && <AddBook onUpdate={fetchBooks} />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <BookCard key={book._id} book={book} onUpdate={fetchBooks} />
                ))}
            </div>
        </div>
    );
};

export default BookList; 