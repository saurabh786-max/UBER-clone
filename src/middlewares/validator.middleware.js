import {body} from "express-validator"

export const validateRegister = [
    body("firstname").notEmpty().withMessage("first name is required "),
    body("email").trim().isEmail().withMessage("invalid Email "),
    body("password").isLength({min:6}).withMessage("password must be at least ^ character long ")
];

export const validateCaptianRegister = [
    body("firstname").notEmpty(),
    body("email").trim().isEmail().withMessage("invalid Email ").withMessage("first name is required "),
    body("password").isLength({min:6}).withMessage("password must be at least ^ character long "),
    body("vehicle.color").notEmpty().withMessage("vehicle color is required"),
    body("vehicle.plate").notEmpty().withMessage("vehicle plate is required"),
    body("vehicle.capacity").isInt({min:1}).withMessage("vehicle capacity must be at least 1"),
    body("vehicle.vehcleType").isIn(["car","motorcycle","auto"]).withMessage("invalid vehicle type")
];


export const validateLogin = [
    body("email").isEmail().withMessage("invalid email"),
    body('password').isLength({min:6}).withMessage("password cannot be less than 6 charecters")
]

