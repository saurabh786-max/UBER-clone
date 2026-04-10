import { Router } from "express";
import { getUserProfile, loginUser, registerUser } from "../controllers/user.controller.js";
import { validateLogin, validateRegister } from "../middlewares/validator.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validateRegister,registerUser)

router.route("/login").post(validateLogin,loginUser)
router.route("/profile").post(verifyJWT,getUserProfile)
export default router;