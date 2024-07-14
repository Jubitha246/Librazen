import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import Book from '../model/book.model.js';

// User signup
export const signup = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create a new user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
      role: role || 'user', // Default role is 'user'
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

// User Profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const issuedBooks = await Book.find({ issuedTo: userId });
    const dueBooks = issuedBooks.filter(book => book.dueDate < new Date());
    const returnedBooks = issuedBooks.filter(book => book.returned);
    const dues = dueBooks.length * 10;

    res.status(200).json({
      user: {
        fullname: user.fullname,
        email: user.email,
        role: user.role
      },
      booksIssued: issuedBooks.length,
      booksReturned: returnedBooks.length,
      dues,
      deadlines: issuedBooks.map(book => ({
        title: book.title,
        author: book.author,
        category: book.category,
        image: book.image,
        dueDate: book.dueDate
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user._id;
    const admin = await User.findById(adminId);
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
//borrowed books for user
export const getBorrowedBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('borrowedBooks.book');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.borrowedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching borrowed books', error });
  }
};
//return book
export const returnBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const user = await User.findById(req.user._id);
    const borrowedBookIndex = user.borrowedBooks.findIndex(borrowedBook => borrowedBook.book.toString() === bookId);
    if (borrowedBookIndex === -1) {
      return res.status(404).json({ message: 'Book not found in borrowed books' });
    }
    const { dueDate } = user.borrowedBooks[borrowedBookIndex];
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