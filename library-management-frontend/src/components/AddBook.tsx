import React, { useState } from 'react';
import { createBook } from '../services/bookService';
import { toast } from 'react-hot-toast';

interface AddBookProps {
    onUpdate: () => void;
}

const AddBook: React.FC<AddBookProps> = ({ onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        ISBN: '',
        publishedDate: '',
        genre: 'Fiction',
        copiesAvailable: 1
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBook(newBook);
            toast.success('Book added successfully');
            setIsOpen(false);
            setNewBook({
                title: '',
                author: '',
                ISBN: '',
                publishedDate: '',
                genre: 'Fiction',
                copiesAvailable: 1
            });
            onUpdate();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add book');
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4"
            >
                Add New Book
            </button>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h3 className="text-xl font-semibold mb-4">Add New Book</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <input
                        type="text"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">ISBN</label>
                    <input
                        type="text"
                        value={newBook.ISBN}
                        onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Published Date</label>
                    <input
                        type="date"
                        value={newBook.publishedDate}
                        onChange={(e) => setNewBook({ ...newBook, publishedDate: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Genre</label>
                    <select
                        value={newBook.genre}
                        onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
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
                        value={newBook.copiesAvailable}
                        onChange={(e) => setNewBook({ ...newBook, copiesAvailable: parseInt(e.target.value) })}
                        required
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Add Book
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBook; 