import { Router } from "express";
import { getUserProfile, loginUser, refreshAccessToken, logoutUser, registerUser } from "../controllers/user.controller.js";
import { validateLogin, validateRegister } from "../middlewares/validator.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(validateRegister,registerUser)

router.route("/login").post(validateLogin,loginUser)
router.route("/profile").post(verifyJWT,getUserProfile)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
export default router;