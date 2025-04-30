import { useState, useEffect, useCallback } from "react";
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
    const [actionLoading, setActionLoading] = useState("");
    const { books, loading, error, fetchBooks, borrow, returnBook, removeBook } = useBook();
    const { user } = useAuth();

    useEffect(() => {
        fetchBooks().catch(err => console.error("Initial fetch error:", err));
    }, []);

    const handleRefresh = useCallback(() => {
        fetchBooks().catch(err => {
            console.error("Error refreshing books:", err);
            toast.error("Failed to refresh books");
        });
    }, [fetchBooks]);

    const handleBorrowReturn = async (bookId: string, isBorrowed: boolean) => {
        try {
            setActionLoading(bookId);
            isBorrowed ? await returnBook(bookId) : await borrow(bookId);
            await fetchBooks();
        } catch {
            toast.error(isBorrowed ? "Failed to return book" : "Failed to borrow book");
        } finally {
            setActionLoading("");
        }
    };

    const handleDelete = async (bookId: string) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            setActionLoading(bookId);
            await removeBook(bookId);
            await fetchBooks();
            toast.success("Book deleted");
        } catch {
            toast.error("Failed to delete book");
        } finally {
            setActionLoading("");
        }
    };

    const filteredBooks = books?.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.ISBN.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

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
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Books</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your library's collection</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                    {user?.role === "admin" && (
                        <Link
                            to="/books/new"
                            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md shadow-sm hover:from-indigo-500 hover:to-purple-500"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Add Book
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-md pl-10 pr-3 py-1.5 text-sm text-gray-900 ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                    />
                </div>
                <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-not-allowed opacity-50"
                    title="Filter (Coming soon)"
                    disabled
                >
                    <Filter className="h-5 w-5 mr-2 text-gray-400" />
                    Filter
                    <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                </button>
            </div>

            {filteredBooks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No books found</div>
            ) : (
                <div className="overflow-hidden border border-gray-200 rounded-lg bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {["Title", "Author", "ISBN", "Published Date", "Genre", "Available", "Actions"].map((col) => (
                                    <th key={col} className={`px-6 py-3 text-xs font-medium text-left uppercase tracking-wider text-gray-500 ${col === "Actions" ? "text-right" : ""}`}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredBooks.map(book => {
                                const isBorrowed = book.borrowedBy?.some(b => b.userId === user?._id && !b.returnDate);

                                return (
                                    <tr key={book._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{book.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{book.author}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{book.ISBN}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(book.publishedDate)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                                                {book.genre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 flex items-center">
                                            <span className={`h-2 w-2 rounded-full ${book.copiesAvailable > 0 ? "bg-green-400" : "bg-red-400"}`} />
                                            <span className="ml-2">{book.copiesAvailable}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <div className="flex justify-end space-x-2">
                                                {user?.role === "admin" && (
                                                    <>
                                                        <Link to={`/books/${book._id}`} title="Edit" className="p-1 rounded-md text-indigo-600 hover:bg-indigo-50 hover:text-indigo-900">
                                                            <Edit className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(book._id!)}
                                                            title="Delete"
                                                            className="p-1 rounded-md text-red-600 hover:bg-red-50 hover:text-red-900"
                                                            disabled={actionLoading === book._id}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                                {user && (
                                                    <button
                                                        onClick={() => handleBorrowReturn(book._id!, isBorrowed!)}
                                                        title={isBorrowed ? "Return Book" : "Borrow Book"}
                                                        className={`p-1 rounded-md transition-colors ${isBorrowed
                                                            ? "text-orange-600 hover:bg-orange-50 hover:text-orange-900"
                                                            : "text-green-600 hover:bg-green-50 hover:text-green-900"}`}
                                                        disabled={actionLoading === book._id || (!isBorrowed && book.copiesAvailable === 0)}
                                                    >
                                                        <BookOpenCheck className="w-5 h-5" />
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
