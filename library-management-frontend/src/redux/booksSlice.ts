import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Book {
  id: string;
  title: string;
  author: string;
  ISBN: string;
  publishedDate: string;
  genre: string;
  copiesAvailable: number;
}

interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks(state, action: PayloadAction<Book[]>) {
      state.books = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const { setBooks, setLoading, setError } = booksSlice.actions;

export default booksSlice.reducer;
