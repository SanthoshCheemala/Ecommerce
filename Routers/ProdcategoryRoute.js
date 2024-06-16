import express from 'express'
import { GetCategory, GetallCategory, createCategory, deleteCategory, updateCategory } from '../controller/ProdcategoryCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/get-category/:id',authMiddleware,isAdmin,GetCategory)
router.get('/getAllcategory',authMiddleware,isAdmin,GetallCategory)
router.post('/create-category',authMiddleware,isAdmin,createCategory)
router.put('/update-category/:id',authMiddleware,isAdmin,updateCategory)
router.delete('/delete-category/:id',authMiddleware,isAdmin,deleteCategory)


export default router;