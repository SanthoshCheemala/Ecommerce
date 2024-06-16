import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { ObjectId } from "mongodb";
import crypto from 'crypto'


var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        index:true,
    },
    lastname:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        default:"user"
    },
    cart:{
        type:Array,
        default:[]
    },
    address:{
        type:String,
    },
    wishlist:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}],
    RefreshToken:{
        type:String,
    },
    passwordChangedAt:String,
    passwordResetToken:String,
    passwordResetExpires:String
},{
    timestamps:true,
})

userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password,salt)
})
userSchema.methods.isPassWordMatched = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)
}
userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resettoken)
      .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
    return resettoken;
  };
export const User =  mongoose.model('User', userSchema);