
import mongoose from 'mongoose';

const borrowedBySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  borrowDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnedDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Returned'], default: 'Pending' }
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  availableCopies: { type: Number, default: 1 },
  borrowedBy: [borrowedBySchema]
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;
