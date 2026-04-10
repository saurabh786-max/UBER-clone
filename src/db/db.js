import mongoose from "mongoose";
import { DB_NAME } from "../constants/constants.js";

const connectDB = async()=>{
   try {
     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
     console.log(`\n MONGO_DB connection successfull !! DB _HOST:${connectionInstance.connection.host}`)
   } catch (error) {
    
   }
}

export default connectDB;