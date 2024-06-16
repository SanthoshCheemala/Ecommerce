import  Jwt  from "jsonwebtoken";

export const generateRefreshToken = (id) =>{
     return Jwt.sign({id},process.env.SECRET_KEY,{expiresIn:'3d'})
}