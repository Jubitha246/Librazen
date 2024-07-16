import mongoose from 'mongoose';

const borrowedBooksSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  borrowDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnedDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Returned'], default: 'Pending' }
});

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  borrowedBooks: [borrowedBooksSchema],
  booksIssued: { type: Number, default: 0 },
  booksReturned: { type: Number, default: 0 },
  dues: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

