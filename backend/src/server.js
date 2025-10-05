import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { connectToDatabase } from './shared/config/db.js';
import { errorHandler, notFoundHandler } from './shared/utils/errorHandler.js';
import authRoutes from './auth/authRoutes.js';
import bookRoutes from './books/bookRoutes.js';
import reviewRoutes from './reviews/reviewRoutes.js';

dotenv.config();

const app = express();

// CORS: permissive for development (reflects request origin)
const isProduction = process.env.NODE_ENV === 'production';
app.use(cors({
  origin: isProduction ? (process.env.CLIENT_URL || false) : true,
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Ensure preflight OPTIONS requests are handled
app.options('*', cors());
app.options('*', cors());
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 5002;
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });


