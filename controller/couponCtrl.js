import AsyncHandler from "express-async-handler";
import { Coupon } from "../models/couponModel.js";
import { validateMongoDbId } from '../utils/validateMongodbid.js'


export const createCoupen = AsyncHandler(async (req,res)=>{
    try {
        const NewCoupon = await Coupon.create(req.body)
        res.json(NewCoupon)
    } catch (error) {
        throw new Error(error)   
    }
})

export const GetAllCoupons = AsyncHandler(async (req,res)=>{
    try {
        const AllCoupons = await Coupon.find();
        res.json(AllCoupons)
    } catch (error) {
        throw new Error(error)   
    }
})

export const UpdateCoupon = AsyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const UpdatedCoupon = await Coupon.findByIdAndUpdate(id,req.body,{new:true});
        res.json(UpdatedCoupon)
    } catch (error) {
        throw new Error(error)   
    }
})

export const DeleteCoupon = AsyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const DeletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json(DeletedCoupon)
    } catch (error) {
        throw new Error(error)   
    }
})
export const GetaCoupon = AsyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongoDbId(id)
    try {
        const coupon = await Coupon.findById(id);
        res.json(coupon)
    } catch (error) {
        throw new Error(error)   
    }
})