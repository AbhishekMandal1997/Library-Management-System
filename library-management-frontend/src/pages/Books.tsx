import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBook } from "../context/BookContext";
import { useAuth } from "../context/AuthContext";
import {
    PlusCircle,
    Search,
    Edit,
    Trash2,
    BookOpenCheck,
    Filter,
    ChevronDown,
    RefreshCw,
} from "lucide-react";
import { formatDate } from "../lib/utils";
import { toast } from "react-hot-toast";

export default function Books() {
    const [searchQuery, setSearchQuery] = useState("");
    const { books, loading, error, fetchBooks, borrow, returnBook, removeBook } = useBook();
    const { user } = useAuth();

    useEffect(() => {
        console.log('Books component mounted, fetching books...');
        const loadBooks = async () => {
            try {
                await fetchBooks();
            } catch (err) {
                console.error('Error in Books component:', err);
            }
        };
        loadBooks();
    }, []);

    const handleRefresh = () => {
        console.log('Manually refreshing books...');
        fetchBooks().catch(err => {
            console.error('Error refreshing books:', err);
            toast.error('Failed to refresh books');
        });
    };

    const handleBorrowReturn = async (bookId: string, isBorrowed: boolean) => {
        try {
            if (isBorrowed) {
                await returnBook(bookId);
            } else {
                await borrow(bookId);
            }
            await fetchBooks();
        } catch (err) {
            console.error('Error handling borrow/return:', err);
            toast.error(isBorrowed ? 'Failed to return book' : 'Failed to borrow book');
        }
    };

    const handleDelete = async (bookId: string) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await removeBook(bookId);
                await fetchBooks();
                toast.success('Book deleted successfully');
            } catch (err) {
                console.error('Error deleting book:', err);
                toast.error('Failed to delete book');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-600">Loading books...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    if (!Array.isArray(books)) {
        console.error('Books is not an array:', books);
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 mb-4">Invalid book data received</div>
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.ISBN.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Books</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your library's collection of books
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                    {user?.role === 'admin' && (
                        <Link
                            to="/books/new"
                            className="inline-flex items-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-purple-500"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Add Book
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                    <Filter className="mr-2 h-5 w-5 text-gray-400" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                </button>
            </div>

            {filteredBooks.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No books found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Author
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    ISBN
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Published Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Genre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Available
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredBooks.map((book) => {
                                const isBorrowed = book.borrowedBy?.some(
                                    borrow => borrow.userId === user?._id && !borrow.returnDate
                                );

                                return (
                                    <tr
                                        key={book._id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {book.title}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-500">{book.author}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-500">{book.ISBN}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-500">
                                                {formatDate(book.publishedDate)}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="inline-flex rounded-full bg-indigo-100 px-2 text-xs font-semibold leading-5 text-indigo-800">
                                                {book.genre}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${book.copiesAvailable > 0
                                                        ? "bg-green-400"
                                                        : "bg-red-400"
                                                        }`}
                                                />
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {book.copiesAvailable}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {user?.role === 'admin' && (
                                                    <>
                                                        <Link
                                                            to={`/books/${book._id}`}
                                                            className="rounded-md p-1 text-indigo-600 transition-colors hover:bg-indigo-50 hover:text-indigo-900"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(book._id!)}
                                                            className="rounded-md p-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-900"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {user && (
                                                    <button
                                                        onClick={() => handleBorrowReturn(book._id!, isBorrowed)}
                                                        className={`rounded-md p-1 transition-colors ${isBorrowed
                                                            ? "text-orange-600 hover:bg-orange-50 hover:text-orange-900"
                                                            : "text-green-600 hover:bg-green-50 hover:text-green-900"
                                                            }`}
                                                        title={isBorrowed ? "Return Book" : "Borrow Book"}
                                                        disabled={!isBorrowed && book.copiesAvailable === 0}
                                                    >
                                                        <BookOpenCheck className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 