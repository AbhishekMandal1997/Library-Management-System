import mongoose, { Schema, Document } from 'mongoose';

export interface IBorrowedBook {
  bookId: string;
  borrowDate: string;
  returnDate?: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  borrowedBooks: IBorrowedBook[];
}

const borrowedBookSchema = new Schema<IBorrowedBook>({
  bookId: { type: String, required: true },
  borrowDate: { type: String, required: true },
  returnDate: { type: String }
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    borrowedBooks: { type: [borrowedBookSchema], default: [] }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
