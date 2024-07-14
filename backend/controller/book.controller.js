import Book from '../model/book.model.js';
import Category from '../model/category.model.js';
import User from '../model/user.model.js';
import fs from 'fs';
import path from 'path';
export const addBook = async (req, res) => {
  const { title, author, category } = req.body;
  const image = req.file ? req.file.filename : '';
  try {
    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      if (image) {
        fs.unlink(path.join('uploads', image), (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
      return res.status(400).json({ message: 'Category does not exist' });
    }
    const newBook = new Book({ title, author, category, image });
    await newBook.save();
    existingCategory.books.push(newBook._id);
    await existingCategory.save();

    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Error adding book', error });
  }
};
export const getBook = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
};
export const getBooksByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const category = await Category.findOne({ name: categoryName }).populate('books');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const books = await Book.find({ _id: { $in: category.books } });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books by category:', error);
    res.status(500).json({ message: 'Error fetching books by category', error });
  }
};
export const borrowBook = async (req, res) => {
  const { bookId } = req.params;
  const { dueDate } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot borrow books' });
    }
    if (book.borrowedBy.some(borrow => borrow.user.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'You have already borrowed this book' });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for borrowing' });
    }
     await User.findByIdAndUpdate(req.user._id, {
      $push: { borrowedBooks: { book: bookId, dueDate,borrowedDate:new Date() } }
    });
    await Book.findByIdAndUpdate(bookId, {
      $push: { borrowedBy: { user: req.user._id, dueDate,borrowedDate:new Date() } },
      $inc: { availableCopies: -1 }
    });
    res.status(200).json({ message: 'Book borrowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error borrowing book', error });
  }
};
export const returnBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot return books' });
    }
    const borrowedBook = req.user.borrowedBooks.find(borrow => borrow.book.toString() === bookId);
    if (!borrowedBook) {
      return res.status(400).json({ message: 'You have not borrowed this book' });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { borrowedBooks: { book: bookId } }
    });
    await Book.findByIdAndUpdate(bookId, {
      $pull: { borrowedBy: { user: req.user._id } },
      $inc: { availableCopies: 1 }
    });
    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error returning book', error });
  }
};
export const getBorrowedBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('borrowedBooks.book')
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const borrowedBooks = user.borrowedBooks.map(borrowedBook => ({
      book: borrowedBook.book,
      borrowDate: borrowedBook.borrowDate,
      dueDate: borrowedBook.dueDate,
      returnDate: borrowedBook.returnDate || null,
      status: borrowedBook.returnDate ? 'Returned' : 'Borrowed'
    }));

    res.status(200).json(borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrowed books', error });
  }
};
export const checkBookStatus = async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Book.findById(bookId).populate('borrowedBy.user', 'name');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ message: 'Error checking book status', error });
  }
};
export const deleteBook = async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.image) {
      fs.unlink(path.join('uploads', book.image), (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    const category = await Category.findOne({ name: book.category });
    if (category) {
      category.books.pull(bookId);
      await category.save();
    }
    await Book.findByIdAndDelete(bookId);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book', error });
  }
};
export const updateBook = async (req, res) => {
  try {
    const { title, author, category } = req.body;
    const image = req.file ? req.file.filename : null;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, category, image },
      { new: true }
    );
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: 'Error updating book', error });
  }
};