import express from "express"
import dotenv from "dotenv"
import cors from "cors"
const app = express();

dotenv.config({
    path:"./.env"
})

app.use(express.json({limit:"16kb"}))
app.use(cors())

app.get("/",(req,res)=>{
    res.send("hello world")
})


export default app;