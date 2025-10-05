import { Review } from './reviewModel.js';
import { createHttpError } from '../shared/utils/errorHandler.js';
import { recomputeBookAverage } from '../books/bookController.js';

export async function addReview(req, res, next) {
  try {
    const { bookId, rating, reviewText } = req.body;
    if (!bookId || !rating || !reviewText) throw createHttpError(400, 'All fields are required');
    const review = await Review.create({ bookId, userId: req.user.id, rating, reviewText });
    await recomputeBookAverage(review.bookId);
    res.status(201).json(review);
  } catch (err) {
    if (err?.code === 11000) return next(createHttpError(409, 'You have already reviewed this book'));
    next(err);
  }
}

export async function updateReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw createHttpError(404, 'Review not found');
    if (review.userId.toString() !== req.user.id) throw createHttpError(403, 'Not allowed');
    if (req.body.rating !== undefined) review.rating = req.body.rating;
    if (req.body.reviewText !== undefined) review.reviewText = req.body.reviewText;
    await review.save();
    await recomputeBookAverage(review.bookId);
    res.json(review);
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) throw createHttpError(404, 'Review not found');
    if (review.userId.toString() !== req.user.id) throw createHttpError(403, 'Not allowed');
    const bookId = review.bookId;
    await review.deleteOne();
    await recomputeBookAverage(bookId);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
}


