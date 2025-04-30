import React, { useState } from 'react';
import { useBooks } from '../contexts/BookContext';
import { Book } from '../types/book';
import { toast } from 'react-hot-toast';

const ManageBooks: React.FC = () => {
    const { books, loading, error, addBook, updateBook, deleteBook } = useBooks();
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Partial<Book>>({
        title: '',
        author: '',
        ISBN: '',
        publishedDate: '',
        genre: 'Fiction',
        copiesAvailable: 1
    });

    const handleEdit = (book: Book) => {
        setSelectedBook(book);
        setFormData({
            title: book.title,
            author: book.author,
            ISBN: book.ISBN,
            publishedDate: book.publishedDate,
            genre: book.genre,
            copiesAvailable: book.copiesAvailable
        });
        setIsEditing(true);
    };

    const handleDelete = async (bookId: string) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook(bookId);
                toast.success('Book deleted successfully');
            } catch (error) {
                toast.error('Failed to delete book');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && selectedBook) {
                await updateBook(selectedBook._id, formData);
                toast.success('Book updated successfully');
            } else {
                await addBook(formData as Omit<Book, '_id'>);
                toast.success('Book added successfully');
            }
            setIsEditing(false);
            setIsAdding(false);
            setSelectedBook(null);
            setFormData({
                title: '',
                author: '',
                ISBN: '',
                publishedDate: '',
                genre: 'Fiction',
                copiesAvailable: 1
            });
        } catch (error) {
            toast.error('Operation failed');
        }
    };

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
                <h1 className="text-3xl font-bold">Manage Books</h1>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setIsEditing(false);
                        setSelectedBook(null);
                        setFormData({
                            title: '',
                            author: '',
                            ISBN: '',
                            publishedDate: '',
                            genre: 'Fiction',
                            copiesAvailable: 1
                        });
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Add New Book
                </button>
            </div>

            {(isEditing || isAdding) && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {isEditing ? 'Edit Book' : 'Add New Book'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Author</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ISBN</label>
                                <input
                                    type="text"
                                    value={formData.ISBN}
                                    onChange={(e) => setFormData({ ...formData, ISBN: e.target.value })}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Published Date</label>
                                <input
                                    type="date"
                                    value={formData.publishedDate}
                                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Genre</label>
                                <select
                                    value={formData.genre}
                                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="Fiction">Fiction</option>
                                    <option value="Non-Fiction">Non-Fiction</option>
                                    <option value="Science">Science</option>
                                    <option value="History">History</option>
                                    <option value="Biography">Biography</option>
                                    <option value="Academic">Academic</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Copies Available</label>
                                <input
                                    type="number"
                                    value={formData.copiesAvailable}
                                    onChange={(e) => setFormData({ ...formData, copiesAvailable: parseInt(e.target.value) })}
                                    required
                                    min="1"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                {isEditing ? 'Update Book' : 'Add Book'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setIsAdding(false);
                                    setSelectedBook(null);
                                }}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div key={book._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                        <p className="text-gray-600 mb-1">Author: {book.author}</p>
                        <p className="text-gray-600 mb-1">ISBN: {book.ISBN}</p>
                        <p className="text-gray-600 mb-1">Genre: {book.genre}</p>
                        <p className="text-gray-600 mb-1">Available: {book.copiesAvailable}</p>
                        <div className="mt-4 flex space-x-4">
                            <button
                                onClick={() => handleEdit(book)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(book._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageBooks; 