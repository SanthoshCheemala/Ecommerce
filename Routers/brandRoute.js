import express from "express";

import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
import { GetBrand, GetallBrand, createBrand, deleteBrand, updateBrand } from "../controller/brandCtrl.js";
const router = express.Router();

router.get('/get-category/:id',authMiddleware,isAdmin,GetBrand)
router.get('/getAllcategory',authMiddleware,isAdmin,GetallBrand)
router.post('/create-category',authMiddleware,isAdmin,createBrand)
router.put('/update-category/:id',authMiddleware,isAdmin,updateBrand)
router.delete('/delete-category/:id',authMiddleware,isAdmin,deleteBrand)

export default router;