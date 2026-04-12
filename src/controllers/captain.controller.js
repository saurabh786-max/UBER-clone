import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

import { Captain } from "../models/captain.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const captainRegister = asyncHandler(async(req,res)=>{
    const{firstname,lastname,email,password,vehicle} = req.body;

    console.log(req.body)

    const errors =validationResult(req);
    if(!errors.isEmpty()){
        const errorMessage = errors.array().map((e)=>e.msg);
        throw new apiError(403, errorMessage)
    }

    const existingUser = await Captain.findOne({email});
    if(existingUser){
        throw new apiError(402,"this captain already existed please try with diffrent email ")
    }

   const captain =  await Captain.create({
        firstname,
        lastname,
        email,
        password,
        vehicle
    })

    const createdCaptain = await Captain.findById(captain._id).select("-password -refreshToken")
 
    return res.status(200)
    .json( new apiResponse(200,createdCaptain,"captain registered successfully "))

})


export{captainRegister}