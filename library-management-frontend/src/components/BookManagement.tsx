import React, { useState } from 'react';
import { Book } from '../types/book';
import { updateBook, deleteBook } from '../services/bookService';
import { toast } from 'react-hot-toast';

type Genre = 'Fiction' | 'Non-Fiction' | 'Academic' | 'Biography' | 'Science';

interface BookManagementProps {
  book: Book;
  onUpdate: () => void;
}

const BookManagement: React.FC<BookManagementProps> = ({ book, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState<Partial<Book>>({
    title: book.title,
    author: book.author,
    ISBN: book.ISBN,
    publishedDate: book.publishedDate,
    genre: book.genre,
    copiesAvailable: book.copiesAvailable
  });

  const handleUpdate = async () => {
    if (!book._id) {
      toast.error('Book ID is required for update');
      return;
    }
    try {
      await updateBook(book._id, editedBook);
      toast.success('Book updated successfully');
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update book');
    }
  };

  const handleDelete = async () => {
    if (!book._id) {
      toast.error('Book ID is required for deletion');
      return;
    }
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(book._id);
        toast.success('Book deleted successfully');
        onUpdate();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handleGenreChange = (value: string) => {
    // Only set the genre if it's a valid genre type
    if (value === '' || ['Fiction', 'Non-Fiction', 'Academic', 'Biography', 'Science'].includes(value)) {
      setEditedBook({ ...editedBook, genre: value as Genre });
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Edit Book</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={editedBook.title || ''}
              onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={editedBook.author || ''}
              onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ISBN</label>
            <input
              type="text"
              value={editedBook.ISBN || ''}
              onChange={(e) => setEditedBook({ ...editedBook, ISBN: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Published Date</label>
            <input
              type="date"
              value={editedBook.publishedDate || ''}
              onChange={(e) => setEditedBook({ ...editedBook, publishedDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <select
              value={editedBook.genre || ''}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Genre</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science">Science</option>
              <option value="Biography">Biography</option>
              <option value="Academic">Academic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Copies Available</label>
            <input
              type="number"
              value={editedBook.copiesAvailable ?? 0}
              onChange={(e) =>
                setEditedBook({ ...editedBook, copiesAvailable: parseInt(e.target.value) || 0 })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-x-4">
      <button
        onClick={() => setIsEditing(true)}
        className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
      >
        Edit Book
      </button>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Delete Book
      </button>
    </div>
  );
};

export default BookManagement;
