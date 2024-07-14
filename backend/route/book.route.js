import express from 'express';
import { getBook,deleteBook,addBook,updateBook,getBooksByCategory,borrowBook,getBorrowedBooks,returnBook} from '../controller/book.controller.js';
import { isAuth, isAdmin } from '../middlewares/auth.middleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  }
});

const upload = multer({ storage: storage });
router.delete('/:id',isAuth,isAdmin,deleteBook);
router.get("/", getBook);
router.post('/', isAuth, isAdmin, upload.single('image'), addBook);
router.put('/:id',isAuth,isAdmin,upload.single('image'),updateBook)
router.get('/category/:categoryName', getBooksByCategory);
router.post('/borrow/:bookId', isAuth, borrowBook);
router.post('return/:bookId',isAuth,returnBook);
router.get('/borrowed',isAuth,getBorrowedBooks);
export default router;
