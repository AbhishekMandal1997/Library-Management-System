import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  ISBN: string;
  publishedDate: Date;
  genre: string;
  copiesAvailable: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true
    },
    ISBN: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true
    },
    publishedDate: {
      type: Date,
      required: [true, 'Published date is required']
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true
    },
    copiesAvailable: {
      type: Number,
      required: [true, 'Number of copies available is required'],
      min: [0, 'Copies available must be non-negative']
    }
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true
  }
);

// Ensure indexes
bookSchema.index({ ISBN: 1 }, { unique: true });

// Add pre-save middleware for data validation
bookSchema.pre('save', function (next) {
  if (this.isModified('copiesAvailable') && this.copiesAvailable < 0) {
    next(new Error('Copies available cannot be negative'));
  }
  next();
});

// Clear the model if it's already registered
if (mongoose.models.Book) {
  delete mongoose.models.Book;
}

// Register the model
export const Book = mongoose.model<IBook>('Book', bookSchema);
