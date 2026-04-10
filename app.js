import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();

dotenv.config({
    path:"./.env"
})

app.use(express.json({limit:"16kb"}))
app.use(cors())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.send("hello world")
})


// rotues
import userRouter from "./src/routes/user.routes.js";

app.use("/api/v1/users",userRouter)

export default app;