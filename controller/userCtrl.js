import { generateToken } from "../config/jwttoken.js";
import { User } from "../models/userModel.js";
import AsyncHandler from "express-async-handler";    
import { validateMongoDbId } from "../utils/validateMongodbid.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import JWT from "jsonwebtoken";
import {SendEmail} from "./emailCtrl.js"
import crypto from 'crypto'
import { Cart } from "../models/cartModel.js";
import { Product } from "../models/ProductModel.js";
import { Coupon } from '../models/couponModel.js'
import { uniqid } from 'uniqid'
import { Order } from "../models/orderModel.js";


export const CreateUser = AsyncHandler(async (req,res) =>{
    const email = req.body.email;
    const findUser = await User.findOne({email})
    if(!findUser){
        const Newuser = await User.create(req.body)
        res.json(Newuser)
    } else {
       throw new Error("User Alredy Exists")
    }

})

export const LoginUser = AsyncHandler(async (req,res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email});
    if(findUser && await findUser.isPassWordMatched(req.body.password)){
        const RefreshToken = await generateRefreshToken(findUser?._id)
        const updateUser = await User.findByIdAndUpdate(findUser._id,{
            RefreshToken
        },{
            new:true
        })
        res.cookie('RefreshToken',RefreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000
        })
       res.json({
        _id:findUser?._id,
        firstname:findUser?.firstname,
        lastname:findUser?.lastname,
        email:findUser?.email,
        mobile:findUser?.mobile,
        Token:generateToken(findUser?._id)
       })
    } else {
        throw new Error("Invalid Email or password");
    }
})

export const LoginAdmin = AsyncHandler(async (req,res)=>{
    const email = req.body.email;
    const findAdmin = await User.findOne({email});
    if(findAdmin.role !== "Admin") throw new Error("Not Authorised")
    if(findAdmin && await findAdmin.isPassWordMatched(req.body.password)){
        const RefreshToken = await generateRefreshToken(findAdmin?._id)
        const updateUser = await User.findByIdAndUpdate(findAdmin._id,{
            RefreshToken
        },{
            new:true
        })
        res.cookie('RefreshToken',RefreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000
        })
       res.json({
        _id:findAdmin?._id,
        firstname:findAdmin?.firstname,
        lastname:findAdmin?.lastname,
        email:findAdmin?.email,
        mobile:findAdmin?.mobile,
        Token:generateToken(findAdmin?._id)
       })
    } else {
        throw new Error("Invalid Email or password");
    }
})

export const getAllUsers = AsyncHandler(async (req,res)=>{
    try {
        const AllUsers = await User.find();
        res.json(AllUsers);   
    } catch (error) {
        throw new Error(error)
    }
})

export const GetUser = AsyncHandler(async (req,res)=>{
    try {
        const {id} = req.params
        validateMongoDbId(id)
        console.log(id);
        const findUser = await User.findById(id)
        res.json(findUser);
    } catch (error) {
        throw new Error(error)
    }
})

export const UpdateUser = AsyncHandler(async (req,res)=>{
    try {
        const {_id} = req.findUser
        const UpdatedUser = await User.findByIdAndUpdate(_id,{
            firstname:req?.body.firstname,
            lastname:req?.body.lastname,
            email:req?.body.email,
            mobile:req?.body.mobile,
        },{
            new:true
        })
        res.json(UpdatedUser)
    } catch (error) {
        throw new Error(error)
    }
})

export const DeleteUser = AsyncHandler(async (req,res)=>{
    try {
        const {id} = req.params
        validateMongoDbId(id)
        const DeleteUser = await User.findByIdAndDelete(id)
        res.json(DeleteUser)
    } catch (error) {
        throw new Error(error)
    }
})

export const BlockUser = AsyncHandler(async (req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const UpdatedUser = await User.findByIdAndUpdate(id,{isblock:true},{new:true})
        res.json({
            message:'user is blocked'
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const UnblockUser = AsyncHandler(async (req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const UpdatedUser = await User.findByIdAndUpdate(id,{isblock:false},{new:true})
        res.json({
            message:'user is unblocked'
        })
    } catch (error) {
        throw new Error(error)
    }
})


export const HandleRefreshToken = AsyncHandler(async (req,res)=>{
    if(!req?.headers?.cookie) throw new Error("No Refresh Token in Cookies")
    const RefreshToken = req?.headers?.cookie.split('=')[1];
    const findUser = await User.findOne({RefreshToken})
    if(!findUser)throw new Error("No Refresh Token in Db or Not matched")
    JWT.verify(RefreshToken, process.env.SECRET_KEY,(err,decoded)=>{
        if(err || findUser.id !== decoded.id){
            throw new Error("There is something wrong with Refresh Token");
        }
        const accessToken = generateToken(findUser?._id)
        res.json({accessToken})
    })
})



export const  Logout = AsyncHandler(async (req,res)=>{
    if(!req?.headers?.cookie) throw new Error("No Refresh Token in Cookies")
    const RefreshToken = req?.headers?.cookie.split('=')[1];
    const findUser = await User.findOne({RefreshToken})
    if(!findUser){
        res.clearCookie("RefreshToken",{
            httpOnly:true,
            secure:true
        })
        return res.sendStatus(204) //forbiden
    }
    await User.findByIdAndUpdate(findUser._id,{
        RefreshToken:""
    },{
        new:true
    })
    res.clearCookie("RefreshToken",{
        httpOnly:true,
        secure:true
    })
    return res.sendStatus(204) //forbiden
})

export const UpdatePassword = AsyncHandler(async (req,res)=>{
    const {_id} = req.findUser;
    const password = req.body.password
    validateMongoDbId(_id)
    const findUser = await User.findById(_id)
    if(password){
        findUser.password = password
        const UpdatedPassword =await findUser.save();
        res.json(UpdatedPassword)
    } else {
        res.json(findUser)
    }
})

export const forgotpasswordToken = AsyncHandler(async (req,res)=>{
    const { email } = req.body
    const findUser = await User.findOne({email})
    if(!findUser) throw new Error("User is Not Found with this email")
    try {
        const token = await findUser.createPasswordResetToken();
        await findUser.save();
        const resetUrl = `Hi, Please follow this link to Reset Password. This link valid till 10 min from now. <a href='http//localhost:5000/api/user/reset-password/${token}'>Click Here</a>`
        const data = {
            to:email,
            subject:"Forgot Password Link",
            text:"Hey! User",
            html:resetUrl
        };
        SendEmail(data);
        res.json(token)
    } catch (error) {
        throw new Error(error)
    }
})

export const forgotPassword = AsyncHandler(async (req,res)=>{
    const {password} = req.body
    const {token} = req.params
    const Hashtoken = crypto.createHash("sha256").update(token).digest("hex")
    console.log(Hashtoken);
    const findUser = await User.findOne({
        passwordResetToken:Hashtoken,
        passwordResetExpires:{$gt:Date.now()},
    })
    if(!findUser) throw new Error("This Token is expired")
    findUser.password = password
    findUser.passwordResetExpires = undefined
    findUser.passwordResetToken = undefined
    await findUser.save()
    res.json(findUser)
})

export const GetWishLsit = AsyncHandler(async (req,res)=>{
    const { _id } = req.findUser;
    validateMongoDbId(_id)
    try {
        const UserWishList = await User.findById(_id).populate('wishlist')
        res.json(UserWishList);
    } catch (error) {
        throw new Error(error);
    }
})



export const SaveAddress = AsyncHandler(async (req,res)=>{
    const { _id } = req.findUser;
    validateMongoDbId(_id)
    try {
        const AddressUser = await User.findByIdAndUpdate(_id,
            req.body,
            {
                new:true
            }    
        )
        res.json(AddressUser);
    } catch (error) {
        throw new Error(error);
    }
})

export const UserCart = AsyncHandler(async (req,res)=>{
    const { cart } = req.body;
    const { _id } = req.findUser;
    validateMongoDbId(_id)
    try {
        let Products = [];
        const user = await User.findById(_id)

        const AlreadyExistCart = await Cart.findOne({OrderBy:user._id});
        if(AlreadyExistCart){
            AlreadyExistCart.remove();
        }
        for(let i = 0; i < cart.length;i++){
            let Object = {};
            Object.product = cart[i]._id;
            Object.color = cart[i].color;
            Object.count = cart[i].count;
            let GetPrice = await Product.findById(cart[i]._id).select("price").exec();
            Object.price = GetPrice.price;
            Products.push(Object)
        }
        
        let cartTotal = 0;
        for(let i = 0;i < Products.length;i++){
            cartTotal = cartTotal + Products[i].price * Products[i].count;
        }
        let NewCart = await new Cart({
            Products,
            cartTotal,
            OrderBy:user?._id
        }).save();
        res.json(NewCart)
    } catch (error) {
        throw new Error(error)
    }
})

export const getUserCart = AsyncHandler(async (req,res)=>{
    try {
        const { _id } = req.user
        validateMongoDbId(_id);
        const cart = await Cart.findOne({OrderBy: _id}).populate(
            "products.product","_id title price totalAfterDiscount"
        )
        res.json({
            success:true,
            cart
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const emptyCart = AsyncHandler(async (req,res)=>{
    try {
        const {_id} = req.user
        Cart.findOneAndDelete({OrderBy:_id})
        res.json({
            success:true,
        })
    } catch (error) {
        
    }
})

export const applyCoupon = AsyncHandler(async (req,res)=>{
    try {
        const { coupon } = req.body
        const {_id} = req.user
        validateMongoDbId(_id)
        const validCoupon = await Coupon.findOne({name:coupon})
        if(!validCoupon){
            throw new Error("Invlaid Coupon")
        }
        const user = await User.findById(_id)
        let {Products,cartTotal} = await findOne({OrderBy:user._id}).populate(
            "products.product"
        )
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2)
        await Cart.findOneAndUpdate({OrderBy:user._id},{totalAfterDiscount},{new:true})
        res.json({
            success:true,
            totalAfterDiscount
        })

    } catch (error) {
        throw new Error(error)
    }
})

export const createOrder = AsyncHandler(async (req,res)=>{
    const  {COD,couponApplied} = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const user = await findById(_id)
        const UserCart = await Cart.findOne({OrderBy:user._id})
        let finalAmount = 0;
        if(couponApplied && UserCart.totalAfterDiscount){
            finalAmount = UserCart.totalAfterDiscount
        } else {
            finalAmount = UserCart.totalAfterDiscount
        }
        let newOrder = await new Order({
            products:UserCart.products,
            paymentIntent:{
                id:uniqid(),
                method:COD,
                amount:finalAmount,
                status:"Not Paid",
                createdAt:Date.now(),
                currency:"usd",
            },
            orderBy:user._id
        }).save();
        let bulkOption = UserCart.products.map((item)=>{
            return {
                updateOne:{
                    filter:{_id:item.product._id},
                    update:{$inc:{quantity:-item.count,sold:+item.count}}
                }
            }
        })
        const updated = await Product.bulkWrite(bulkOption,{})
        res.json({
            success:true,
            newOrder
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const getAllOrders = AsyncHandler(async (req,res)=>{
    try {
        const orders = await Order.find({})
        .sort("-createdAt")
        .populate("products.product")
        .exec()
        res.json(orders)
    } catch (error) {
        throw new Error(error)
    }
})

export const getOrder = AsyncHandler(async (req,res)=>{
    const {_id } = req.user
    validateMongoDbId(_id)
    try {
        const orders = await Order.findOne({orderBy:_id})
        .sort("-createdAt")
        .populate("products.product")
        .exec()
        res.json(orders)
    } catch (error) {
        throw new Error(error)
    }
})

export const upadteOrderStatus = AsyncHandler(async (req,res)=>{
    const {orderStatus} = req.body
    const {orderId} = req.params
    validateMongoDbId(orderId)
    try {
        const updated = await Order.findByIdAndUpdate(orderId,{orderStatus,paymentIntent:{
            status:orderStatus
        }},{new:true})
        res.json(updated)
    } catch (error) {
        throw new Error(error)
    }
})