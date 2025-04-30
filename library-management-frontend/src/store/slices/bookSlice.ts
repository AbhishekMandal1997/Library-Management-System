import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Book } from '../../types/book';

interface BookState {
    books: Book[];
    loading: boolean;
    error: string | null;
}

const initialState: BookState = {
    books: [],
    loading: false,
    error: null,
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:5000/api/books');
        return response.data;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to fetch books');
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch books');
    }
});

export const addBook = createAsyncThunk(
    'books/addBook',
    async (book: Omit<Book, '_id'>, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/books', book);
            toast.success('Book added successfully');
            return response.data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add book');
            return rejectWithValue(error.response?.data?.message || 'Failed to add book');
        }
    }
);

export const updateBook = createAsyncThunk(
    'books/updateBook',
    async ({ id, book }: { id: string; book: Partial<Book> }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/books/${id}`, book);
            toast.success('Book updated successfully');
            return response.data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update book');
            return rejectWithValue(error.response?.data?.message || 'Failed to update book');
        }
    }
);

export const deleteBook = createAsyncThunk(
    'books/deleteBook',
    async (id: string, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost:5000/api/books/${id}`);
            toast.success('Book deleted successfully');
            return id;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete book');
            return rejectWithValue(error.response?.data?.message || 'Failed to delete book');
        }
    }
);

export const borrowBook = createAsyncThunk(
    'books/borrowBook',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/books/${id}/borrow`);
            toast.success('Book borrowed successfully');
            return response.data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to borrow book');
            return rejectWithValue(error.response?.data?.message || 'Failed to borrow book');
        }
    }
);

export const returnBook = createAsyncThunk(
    'books/returnBook',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/books/${id}/return`);
            toast.success('Book returned successfully');
            return response.data;
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to return book');
            return rejectWithValue(error.response?.data?.message || 'Failed to return book');
        }
    }
);

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
                state.error = null;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBook.fulfilled, (state, action) => {
                state.loading = false;
                state.books.push(action.payload);
                state.error = null;
            })
            .addCase(addBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBook.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.books.findIndex((book) => book._id === action.payload._id);
                if (index !== -1) {
                    state.books[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBook.fulfilled, (state, action) => {
                state.loading = false;
                state.books = state.books.filter((book) => book._id !== action.payload);
                state.error = null;
            })
            .addCase(deleteBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(borrowBook.fulfilled, (state, action) => {
                const index = state.books.findIndex((book) => book._id === action.payload._id);
                if (index !== -1) {
                    state.books[index] = action.payload;
                }
            })
            .addCase(returnBook.fulfilled, (state, action) => {
                const index = state.books.findIndex((book) => book._id === action.payload._id);
                if (index !== -1) {
                    state.books[index] = action.payload;
                }
            });
    },
});

export const { clearError } = bookSlice.actions;
export default bookSlice.reducer; 