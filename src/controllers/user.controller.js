import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const generateAccessTokenAndRefreshToken=async(id)=>{
try{
    const user = await User.findById(id);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({validateBeforeSave:false});
   return{accessToken,refreshToken}
}
catch(error){
    throw new apiError(403,"something went wrong while creating tokens ")
}
}



const registerUser = asyncHandler(async(req,res)=>{
    const{firstname,lastname,email,password} = req.body;

    const errors = validationResult(req);
if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new apiError(400, errorMessages.join(", "));
}
  



    const exsistingUser = await User.findOne({email});

    if(exsistingUser){
        throw new apiError(409,"user with email is already exists"
        )
    }

 const user = await User.create({
        firstname,
        lastname,
        email,
        password
    })

    const createdUser = await  User.findById(user._id).select("-password -refreshToken")
if(!createdUser){
    throw new apiError(500,"something went wrong while creating user")
}


return res.status(201).json(
    new apiResponse(201,createdUser,"user registered successfully !!")
)

})

const loginUser = asyncHandler(async(req,res)=>{


    const{email,password}= req.body;

    const errors  = validationResult(req);

    if(!errors.isEmpty()){
        const errorMessage = errors.array().map(err=>err.msg);
        throw new apiError(403,errorMessage);
    }
    const user = await User.findOne({email});

    if(!user){
        throw new apiError(402,"user not found !!");
    }


    const isvalidUser = await user.isPasswordCorrect(password);

    if(!isvalidUser){
        throw new apiError(402,"invalild password ,please try again ")
    }

    const{accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");


   const options = {
    httpOnly:true,
    secure:false,
    sameSite:"lax"
   }

   return res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new apiResponse(200,"user loggedIn successfully",
        {
            user:loggedInUser,
            accessToken,refreshToken
        }
    )
   )

    



})

const getUserProfile = asyncHandler(async(req,res)=>{
    
})


export{registerUser,loginUser,getUserProfile}