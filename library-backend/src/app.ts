
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import userRoutes from './routes/userRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Error handler
app.use(errorHandler);

// Health check
app.get('/', (_req, res) => res.send('📚 Library API is running...'));

export default app;
