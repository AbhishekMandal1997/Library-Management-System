import React, { useEffect } from 'react';
import { useBook } from '../context/BookContext';
import { Book } from '../types/book';
import { Link } from 'react-router-dom';
import { BookOpen, User } from 'lucide-react';

const Home: React.FC = () => {
    const { books, loading, error, fetchBooks } = useBook();

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Library Management System</h1>
                <p className="mt-2 text-gray-600">Browse our collection of books</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book: Book) => (
                    <div
                        key={book._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 truncate">{book.title}</h2>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${book.copiesAvailable > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {book.copiesAvailable} available
                                </span>
                            </div>

                            <div className="flex items-center text-gray-600 mb-2">
                                <User className="h-4 w-4 mr-2" />
                                <span className="text-sm">{book.author}</span>
                            </div>

                            <div className="flex items-center text-gray-600 mb-4">
                                <BookOpen className="h-4 w-4 mr-2" />
                                <span className="text-sm">{book.genre}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">ISBN: {book.ISBN}</span>
                                <Link
                                    to={`/books/${book._id}`}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home; 