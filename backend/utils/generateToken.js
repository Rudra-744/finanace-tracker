import jwt from "jsonwebtoken";

import bcrypt, { genSalt } from "bcrypt";

const generateToken = (userId,role)=>{
    const accessToken = jwt.sign(
        {id:userId,role},
        process.env.JWT_SECRET || "access_secret",
        {expiresIn:"10m"}
    )
    const refreshToken =jwt.sign(
        {id:userId},
        process.env.REFRESH_SECRET || "refresh_secret",
        {expiresIn:"7d"}
    
    )
    return {accessToken,refreshToken};
};

export default generateToken;