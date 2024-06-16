import express from 'express'
import {  DeleteCoupon, GetAllCoupons, GetaCoupon, UpdateCoupon, createCoupen } from '../controller/couponCtrl.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/',authMiddleware,isAdmin,GetAllCoupons)
router.get('/:id',authMiddleware,isAdmin,GetaCoupon)
router.post('/',authMiddleware,isAdmin,createCoupen)
router.put('/:id',authMiddleware,isAdmin,UpdateCoupon)
router.delete('/:id',authMiddleware,isAdmin,DeleteCoupon)

export default router;