import Book from '../model/book.model.js';
import Category from '../model/category.model.js';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';

// Use a default secret if not set (for development)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const addBook = async (req, res) => {
  const { title, author, category,availableCopies } = req.body;
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
    const newBook = new Book({ title, author, category, image , availableCopies});
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
    const { title, author, category, availableCopies } = req.body;
    const image = req.file ? req.file.filename : null;
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (image && book.image) {
      fs.unlink(path.join('uploads', book.image), (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, category, image ,availableCopies },
      { new: true }
    );
    res.status(200).json({message:'book updated successfully',book:updatedBook});
  } catch (error) {
    res.status(400).json({ message: 'Error updating book', error });
  }
};

// Get analytics data
export const getAnalytics = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get total books
    const totalBooks = await Book.countDocuments();

    // Get total users
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Get total borrows
    const totalBorrows = await User.aggregate([
      { $unwind: '$borrowedBooks' },
      { $count: 'total' }
    ]);

    // Get overdue books
    const overdueBooks = await User.aggregate([
      { $unwind: '$borrowedBooks' },
      { $match: { 'borrowedBooks.dueDate': { $lt: new Date() }, 'borrowedBooks.returnedDate': { $exists: false } } },
      { $count: 'total' }
    ]);

    // Get popular books (most borrowed)
    const popularBooks = await User.aggregate([
      { $unwind: '$borrowedBooks' },
      { $group: { _id: '$borrowedBooks.book', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      { $unwind: '$bookDetails' },
      {
        $project: {
          title: '$bookDetails.title',
          borrows: '$count'
        }
      }
    ]);

    // Get category distribution
    const categoryDistribution = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Get monthly borrowing trends (last 6 months)
    const monthlyBorrows = await User.aggregate([
      { $unwind: '$borrowedBooks' },
      {
        $group: {
          _id: {
            year: { $year: '$borrowedBooks.borrowDate' },
            month: { $month: '$borrowedBooks.borrowDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.month' },
              '/',
              { $toString: '$_id.year' }
            ]
          },
          borrows: '$count'
        }
      }
    ]);

    // Get top readers
    const userActivity = await User.aggregate([
      { $match: { role: 'user' } },
      {
        $project: {
          fullname: 1,
          booksRead: { $size: { $ifNull: ['$borrowedBooks', []] } }
        }
      },
      { $sort: { booksRead: -1 } },
      { $limit: 5 },
      {
        $project: {
          user: '$fullname',
          booksRead: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalBooks,
      totalUsers,
      totalBorrows: totalBorrows[0]?.total || 0,
      overdueBooks: overdueBooks[0]?.total || 0,
      popularBooks,
      categoryDistribution,
      monthlyBorrows,
      userActivity
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};