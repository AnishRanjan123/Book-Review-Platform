import { Book } from './bookModel.js';
import { Review } from '../reviews/reviewModel.js';
import { createHttpError } from '../shared/utils/errorHandler.js';

export async function createBook(req, res, next) {
  try {
    const { title, author, description, genre, year } = req.body;
    if (!title || !author || !description || !genre || !year)
      throw createHttpError(400, 'All fields are required');
    const book = await Book.create({ title, author, description, genre, year, addedBy: req.user.id });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
}

export async function getBooks(req, res, next) {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = 5;
    const skip = (page - 1) * limit;
    const { search, genre, sortBy } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    if (genre) filter.genre = genre;

    const sort = {};
    if (sortBy === 'year') sort.year = -1;
    if (sortBy === 'rating') sort.averageRating = -1;

    const [items, total] = await Promise.all([
      Book.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Book.countDocuments(filter)
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function getBookById(req, res, next) {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) throw createHttpError(404, 'Book not found');
    const reviews = await Review.find({ bookId: book._id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();
    const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
    res.json({ ...book, reviews, averageRating: Number(avg.toFixed(2)) });
  } catch (err) {
    next(err);
  }
}

export async function updateBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw createHttpError(404, 'Book not found');
    if (book.addedBy.toString() !== req.user.id) throw createHttpError(403, 'Not allowed');

    const fields = ['title', 'author', 'description', 'genre', 'year'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) book[f] = req.body[f];
    });
    await book.save();
    res.json(book);
  } catch (err) {
    next(err);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) throw createHttpError(404, 'Book not found');
    if (book.addedBy.toString() !== req.user.id) throw createHttpError(403, 'Not allowed');
    await Review.deleteMany({ bookId: book._id });
    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    next(err);
  }
}

export async function recomputeBookAverage(bookId) {
  const agg = await Review.aggregate([
    { $match: { bookId } },
    { $group: { _id: '$bookId', avg: { $avg: '$rating' } } }
  ]);
  const avg = agg.length ? agg[0].avg : 0;
  await Book.findByIdAndUpdate(bookId, { averageRating: Number(avg.toFixed(2)) });
}


