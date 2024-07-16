import express from 'express';
import { getCategories,addCategory,deleteCategory } from '../controller/category.controller.js';
import {isAuth,isAdmin} from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/', getCategories);
router.post('/',addCategory);
router.delete(':/categoryName',isAuth,isAdmin,deleteCategory);

export default router;
