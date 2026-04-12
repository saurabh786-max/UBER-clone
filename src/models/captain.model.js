import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const captainSchema = new mongoose.Schema({
    firstname :{
        type:String,
        required:true,
        minlength :[3, "firstname must be atleast of length 3"]
    },
    lastname:{
        type:String,
        minlength :[3, "lastname must be atleast of length 3"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    soketId:{
        type:String,
        
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default: "inactive"
    },
    refreshToken:{
        type:String,
    },
    vehicle:{
        color:{
            type:String,
            required: true,
            minlength: [3,"color must be at least 3 character long "]
        },
        plate:{
            type:String,
            required:true,
            minlength: [3, "plate must be at least 3 character long "],
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,"capacity must be at least 1"]
        },
        vehcleType:{
            type:String,
            required:true,
            enum:["car","motorcycle","auto"],
        },
        location:{
            lat:{
                type:Number,
            },
            lng:{
                type:Number
            }
        }

    }


},{timestamps:true})

captainSchema.pre("save",async function (){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password,10)
})

captainSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.ACCESS_TOKEN_SECRET
        ,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
captainSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET
        ,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

captainSchema.methods.isPasswordValid = async function (password){
 return await bcrypt.compare(password,this.password);

 

}

export const  Captain = mongoose.model("Captain",captainSchema);