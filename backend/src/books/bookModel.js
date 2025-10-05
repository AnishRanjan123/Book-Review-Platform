import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    averageRating: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Book = mongoose.model('Book', bookSchema);


