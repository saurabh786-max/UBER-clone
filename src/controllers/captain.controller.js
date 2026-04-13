import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

import { Captain } from "../models/captain.model.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateRefreshAndAccessToken =async(id)=>{
   try {
     const captain = await Captain.findById(id);
     if (!captain) {
    throw new apiError(404, "Captain not found");
}
     const accessToken = await captain.generateAccessToken();
     const refreshToken = await captain.generateRefreshToken();
 
     captain.refreshToken = refreshToken;
     
     await captain.save({validateBeforeSave:false});

     return{accessToken,refreshToken};
   } catch (error) {
     throw new apiError(403, "something went wrong while creating tokens ");
   }
}

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

const loginCaptain = asyncHandler(async(req,res)=>{
  const{email,password} = req.body;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const errorMessage = errors.array().map((e)=>e.msg);
    throw new apiError(403,errorMessage);
  }
  const captain = await Captain.findOne({email});
  if(!captain){
    throw new apiError(403,"captain not found ");
  }
  const validCaptain = await captain.isPasswordValid(password);

  if(!validCaptain){
    throw new apiError(403,"invalid credentails ");
  }

const{accessToken,refreshToken} = await generateRefreshAndAccessToken(captain._id);
const loggedInCaptain = await Captain.findById(captain._id).select("-password -refreshToken")
const options ={
    httpOnly:true,
    sameSite:"lax",
    secure:"false"
}

return res.status(201)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new apiResponse(201,loggedInCaptain,"captain logged in successfully ")
)

})

const getCaptainProfile = asyncHandler(async(req,res)=>{
  const profile = await Captain.findById(req.captain._id).select("-password -refreshToken ");

  return res.status(201)
  .json(
    new apiResponse(201,profile,"provided Captain profile !!!")
  )
})

const logoutCaptain = asyncHandler(async(req,res)=>{

   const captain = await Captain.findByIdAndUpdate(req.captain._id, {
    $set:{
      refreshToken:undefined
    }
  },
{
  new:true
});

const options = {
  httpOnly:true,
  secure:false,
  sameSite:"lax"
}

return res.status(201)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new apiResponse(201,{},"captain logged out successfully !!"))
})

export{captainRegister,loginCaptain,logoutCaptain,getCaptainProfile}