import { Router } from "express";
import { captainRegister, getCaptainProfile, loginCaptain, logoutCaptain } from "../controllers/captain.controller.js";
import { validateCaptianRegister, validateLogin } from "../middlewares/validator.middleware.js";
import verifyCaptainJWT from "../middlewares/authCaptain.middleware.js";


const captainRouter = Router();

captainRouter.route("/register").post(validateCaptianRegister,captainRegister)
captainRouter.route("/login").post(validateLogin,loginCaptain)
captainRouter.route("/logout").get(verifyCaptainJWT,logoutCaptain);
captainRouter.route("/profile").get(verifyCaptainJWT,getCaptainProfile);
export default captainRouter