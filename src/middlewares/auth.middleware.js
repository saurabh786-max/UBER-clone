import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";

const verifyJWT = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new apiError(400,"Unathorized request !!!")
        }

        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user){
            throw new apiError(403,"Invalid accessToken")
        }

        req.user = user;

        next();
    }
    catch(error){
        throw new apiError(401,error?.message || "Invalid access Token");
    }
})

export default verifyJWT;
