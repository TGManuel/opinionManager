import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { isValidEmail } from "../helpers/db-validator.js"

export const registerValidator=[
    body("username").not().isEmpty().withMessage('El username es obligatorio'),
    body("email", 'Ingresar un email válido').not().isEmpty,
    body("email").custom(isValidEmail),
    body("password", "La contraseña debe tener un mínimo de 6 caracteres").isLength({min:6}),
    validarCampos
]   

export const loginValidator=[
    body("email").isEmail().withMessage('Ingresa un email válido'),
    body("password","La contraseña es inválida").isLength({min:6}),
    validarCampos
]