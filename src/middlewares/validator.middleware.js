import {body} from "express-validator"

export const validateRegister = [
    body("firstname").notEmpty(),
    body("email").trim().isEmail().withMessage("invalid Email "),
    body("password").isLength({min:6}).withMessage("password must be at least ^ character long ")
];


export const validateLogin = [
    body("email").isEmail().withMessage("invalid email"),
    body('password').isLength({min:6}).withMessage("password cannot be less than 6 charecters")
]