import Book from '../model/book.model.js';
import Category from '../model/category.model.js';
import fs from 'fs';
import path from 'path';
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
