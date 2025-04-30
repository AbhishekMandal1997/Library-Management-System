export interface Book {
    _id?: string;
    title: string;
    author: string;
    ISBN: string;
    publishedDate: string;
    genre: 'Fiction' | 'Non-Fiction' | 'Academic' | 'Biography' | 'Science';
    copiesAvailable: number;
    borrowedBy?: {
        userId: string;
        borrowDate: string;
        returnDate?: string;
    }[];
    createdAt?: string;
    updatedAt?: string;
} 