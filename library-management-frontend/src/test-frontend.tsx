import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Frontend Tests', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('App renders without crashing', () => {
        render(
            <Provider store={store}>
                <App />
            </Provider>
        );
    });

    test('Book list displays correctly', async () => {
        // Mock the API response
        const mockBooks = [
            {
                _id: '1',
                title: 'Test Book 1',
                author: 'Test Author 1',
                ISBN: '9783161484100',
                publishedDate: '2023-01-01',
                genre: 'Fiction',
                copiesAvailable: 5
            },
            {
                _id: '2',
                title: 'Test Book 2',
                author: 'Test Author 2',
                ISBN: '9783161484101',
                publishedDate: '2023-01-02',
                genre: 'Non-Fiction',
                copiesAvailable: 3
            }
        ];

        mockedAxios.get.mockResolvedValueOnce({ data: mockBooks });

        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        // Wait for books to be loaded
        await waitFor(() => {
            expect(screen.getByText('Test Book 1')).toBeInTheDocument();
            expect(screen.getByText('Test Book 2')).toBeInTheDocument();
        });
    });

    test('Add book form works correctly', async () => {
        const newBook = {
            title: 'New Book',
            author: 'New Author',
            ISBN: '9783161484102',
            publishedDate: '2023-01-03',
            genre: 'Fiction',
            copiesAvailable: 4
        };

        mockedAxios.post.mockResolvedValueOnce({ data: { ...newBook, _id: '3' } });

        render(
            <Provider store={store}>
                <App />
            </Provider>
        );

        // Fill out the form
        fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: newBook.title } });
        fireEvent.change(screen.getByPlaceholderText('Author'), { target: { value: newBook.author } });
        fireEvent.change(screen.getByPlaceholderText('ISBN (10 or 13 digits)'), { target: { value: newBook.ISBN } });
        fireEvent.change(screen.getByPlaceholderText('Genre'), { target: { value: newBook.genre } });
        fireEvent.change(screen.getByPlaceholderText('Copies Available'), { target: { value: newBook.copiesAvailable } });

        // Submit the form
        fireEvent.click(screen.getByText('Add Book'));

        // Wait for the API call
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/books', newBook);
        });
    });
}); 