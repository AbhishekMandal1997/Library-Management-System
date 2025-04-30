import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./booksSlice";
import usersReducer from "./usersSlice";

const store = configureStore({
    reducer: {
        books: booksReducer,
        users: usersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
