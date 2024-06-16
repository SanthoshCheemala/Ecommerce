import mongoose, { disconnect } from "mongoose";// Erase if already required

// Declare the Schema of the Mongo model
var CouponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        upperCase:true
    },
    expiry:{
        type:Date,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
});

//Export the model
export const Coupon = mongoose.model('Coupon', CouponSchema);