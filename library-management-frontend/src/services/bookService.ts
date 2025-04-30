import { Book } from '../types/book';
import api from '../utils/axiosConfig';

export const getAllBooks = async (): Promise<Book[]> => {
    try {
        console.log('Fetching books...');
        const response = await api.get('/books');
        console.log('Books API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
};

export const getBookById = async (id: string): Promise<Book> => {
    try {
        const response = await api.get(`/books/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book with ID ${id}:`, error);
        throw error;
    }
};

export const createBook = async (book: Omit<Book, '_id'>): Promise<Book> => {
    try {
        console.log('Creating book with data:', book);
        const response = await api.post('/books', book);
        console.log('Create book response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating book:', error);
        throw error;
    }
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
    try {
        console.log(`Updating book ${id} with data:`, book);
        const response = await api.put(`/books/${id}`, book);
        console.log('Update book response:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error updating book ${id}:`, error);
        throw error;
    }
};

export const deleteBook = async (id: string): Promise<void> => {
    try {
        console.log(`Deleting book ${id}`);
        await api.delete(`/books/${id}`);
        console.log(`Book ${id} deleted successfully`);
    } catch (error) {
        console.error(`Error deleting book ${id}:`, error);
        throw error;
    }
};

export const borrowBook = async (bookId: string): Promise<void> => {
    try {
        console.log(`Borrowing book ${bookId}`);
        await api.post(`/books/${bookId}/borrow`);
        console.log(`Book ${bookId} borrowed successfully`);
    } catch (error) {
        console.error(`Error borrowing book ${bookId}:`, error);
        throw error;
    }
};

export const returnBook = async (bookId: string): Promise<void> => {
    try {
        console.log(`Returning book ${bookId}`);
        await api.post(`/books/${bookId}/return`);
        console.log(`Book ${bookId} returned successfully`);
    } catch (error) {
        console.error(`Error returning book ${bookId}:`, error);
        throw error;
    }
}; 