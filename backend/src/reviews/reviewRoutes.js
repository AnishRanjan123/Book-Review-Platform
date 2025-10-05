import { Router } from 'express';
import { requireAuth } from '../shared/middleware/auth.js';
import { addReview, updateReview, deleteReview } from './reviewController.js';

const router = Router();

router.post('/', requireAuth, addReview);
router.put('/:id', requireAuth, updateReview);
router.delete('/:id', requireAuth, deleteReview);

export default router;


