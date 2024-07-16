import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import Book from '../model/book.model.js';

// User signup
export const signup = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role: role || 'user',
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'user' });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in as Admin successfully', token, user: admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user._id;
    const admin = await User.findById(adminId).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json({
      user: {
        fullname: admin.fullname,
        email: admin.email,
        role: admin.role
      },
      adminFunctions: {
        addBook: true,
        updateBook: true,
        deleteBook: true,
        viewAllBooks: true,
        manageUsers: true
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password').populate('borrowedBooks.book');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const booksIssued = user.borrowedBooks.length;
    const booksReturned = user.borrowedBooks.filter(borrow => borrow.returnedDate).length;

    res.json({ 
      user: {
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        booksIssued,
        booksReturned,
        dues: user.dues
      },
      borrowedBooks: user.borrowedBooks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Borrow a book
export const borrowBook = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;
    const userId = req.user.id;
    const book = await Book.findById(bookId);
    const user = await User.findById(userId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is not available' });
    }

    const existingBorrow = user.borrowedBooks.find(b => b.book.toString() === bookId && !b.returnedDate);
    if (existingBorrow) {
      return res.status(400).json({ message: 'You have already borrowed this book' });
    }

    user.borrowedBooks.push({ book: bookId, borrowDate: Date.now(), dueDate, status: 'Pending' });
    user.booksIssued += 1;

    book.borrowedBy.push({ user: user._id, borrowDate: Date.now(), dueDate, status: 'Pending' });
    book.availableCopies -= 1;

    await user.save();
    await book.save();
    res.status(200).json({ message: 'Book borrowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Return a book
export const returnBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const borrowIndex = user.borrowedBooks.findIndex(b => b.book.toString() === bookId && !b.returnedDate);
    if (borrowIndex === -1) {
      return res.status(400).json({ message: 'This book was not borrowed or already returned' });
    }

    user.borrowedBooks[borrowIndex].returnedDate = Date.now();
    user.borrowedBooks[borrowIndex].status = 'Returned';
    user.booksReturned += 1;

    const borrowEntry = book.borrowedBy.find(b => b.user.toString() === user._id.toString() && !b.returnedDate);
    if (borrowEntry) {
      borrowEntry.returnedDate = Date.now();
      borrowEntry.status = 'Returned';
    }

    book.availableCopies += 1;
    await user.save();
    await book.save();
    res.status(200).json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
