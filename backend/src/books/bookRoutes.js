import { Router } from 'express';
import { requireAuth } from '../shared/middleware/auth.js';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from './bookController.js';

const router = Router();

router.get('/', getBooks);
router.get('/:id', getBookById);

router.post('/', requireAuth, createBook);
router.put('/:id', requireAuth, updateBook);
router.delete('/:id', requireAuth, deleteBook);

export default router;


