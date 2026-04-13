import { Captain } from "../models/captain.model.js"
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js";


const verifyCaptainJWT = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new apiError(403,"unathorised request ")
        }
        const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        if(!decodedToken){
            throw new apiError(403,"invalid token ");
        }

        const captain = await Captain.findById(decodedToken._id).select("-refreshToken -password ");
 if(!captain){
            throw new apiError(403,"Invalid accessToken")
        }
        req.captain = captain;
        next();
    }
    catch(error){
        throw new apiError(402,"something went wrong while verifying jwt in captain ")
    }
})

export default verifyCaptainJWT;