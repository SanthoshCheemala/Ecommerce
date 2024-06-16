import express from "express";
import { BlockUser, CreateUser, DeleteUser, GetUser, GetWishLsit, HandleRefreshToken, LoginAdmin, LoginUser, Logout, SaveAddress, UnblockUser, UpdatePassword, UpdateUser, UserCart, applyCoupon, createOrder, emptyCart, forgotPassword, forgotpasswordToken, getAllUsers, getOrder, getUserCart } from "../controller/userCtrl.js";
import { authMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router()


router.get('/refresh',HandleRefreshToken)
router.get('/AllUsers',authMiddleware,getAllUsers)
router.get('/UserCart',getUserCart)
router.get('/getUser/:id',authMiddleware,isAdmin,GetUser)
router.get('get-Order/:id',authMiddleware,getOrder)
router.get('/logout',Logout)
router.get('/wishlist',authMiddleware,GetWishLsit)
router.post('/register',CreateUser)
router.post('/login-user',LoginUser)
router.post('/login-admin',LoginAdmin)
router.post('/usercart',UserCart)
router.post('/cart/cash-order',authMiddleware,createOrder)
router.post('/forgot-password-token',forgotpasswordToken)
router.put('/reset-password/:token',forgotPassword)
router.delete('/deleteUser/:id',DeleteUser)
router.delete('/empty-cart',authMiddleware,emptyCart)
router.put('/updateUser/edit-user',authMiddleware,UpdateUser)
router.put('/block-user/:id',authMiddleware,isAdmin,BlockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,UnblockUser);
router.put('/updatepassword',authMiddleware,UpdatePassword)
router.put('/AddAddress',authMiddleware,SaveAddress);
router.put('/apply-coupon',authMiddleware,applyCoupon)
router.put('/order/update-status/:orderId',authMiddleware,isAdmin,UpdateOrderStatus)


export default router;