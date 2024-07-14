import express from 'express';
import { signup, loginUser, loginAdmin, getUserProfile, getAdminProfile,getBorrowedBooks,returnBook} from '../controller/user.controller.js';
import {isAuth,isAdmin} from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', loginUser);
router.get('/user/profile', isAuth, getUserProfile);
router.post('/login/admin',loginAdmin);
router.get('/admin/profile',isAuth,isAdmin,getAdminProfile);
router.get('/borrowedBooks',isAuth,getBorrowedBooks);
router.post('/book/return/:bookId',isAuth,returnBook);
export default router;
