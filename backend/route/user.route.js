import express from 'express';
import { signup, loginUser, loginAdmin, getAdminProfile, updateAdminProfile, getUserProfile, borrowBook, returnBook, getAllUsersWithBorrowedBooks, getOverdueUsers, getLibraryStatistics } from '../controller/user.controller.js';
import { isAuth, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', loginUser);
router.post('/login/admin', loginAdmin);

// Protected routes
router.get('/user/profile', isAuth, getUserProfile);
router.get('/admin/profile', isAuth, isAdmin, getAdminProfile);
router.put('/admin/profile/update', isAuth, isAdmin, updateAdminProfile);
router.post('/borrow', isAuth, borrowBook);
router.post('/book/return', isAuth, returnBook);

// Admin-only routes
router.get('/admin/users/borrowed', isAuth, isAdmin, getAllUsersWithBorrowedBooks);
router.get('/admin/users/overdue', isAuth, isAdmin, getOverdueUsers);
router.get('/admin/statistics', isAuth, isAdmin, getLibraryStatistics);

export default router;