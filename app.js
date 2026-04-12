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



// rotues
import userRouter from "./src/routes/user.routes.js";
import captainRouter from "./src/routes/captain.routes.js";
// user-routes
app.use("/api/v1/users",userRouter)
// captain-routes
app.use("/api/v1/captain",captainRouter)

export default app;