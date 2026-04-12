import { Router } from "express";
import { captainRegister } from "../controllers/captain.controller.js";


const captainRouter = Router();

captainRouter.route("/register").post(captainRegister)

export default captainRouter