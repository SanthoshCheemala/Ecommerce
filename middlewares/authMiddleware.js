import JWT from "jsonwebtoken";
import { User } from "../models/userModel.js";
import AsyncHandler from "express-async-handler";


export const authMiddleware = AsyncHandler(async (req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
        try {
            if(token){
                const decode = JWT.verify(token,process.env.SECRET_KEY);
                const findUser = await User.findById(decode?.id);
                req.findUser = findUser;
                next();
            }
        } catch (error) {
            throw new Error("not authrization, please Login again")
        }
    } else {
        throw new Error(" There is no token attached to header")
    }
})

export const isAdmin = AsyncHandler(async (req,res,next)=>{
    const AdminUser = await User.findById(req.findUser._id)
    if(AdminUser.role !== 'Admin'){
        throw new Error("Your not a Admin")
    } else {
        next(); 
    }
})

