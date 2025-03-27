import { hash, verify } from "argon2";
import Usuario from "../users/user.model.js";
import { generarJWT } from "../helpers/generate-jwt.js";

export const login = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });

        if (!user) {
            return res.status(400).json({
                msg: "Error: Credenciales incorrectas, el correo o usuario no existen en la base de datos."
            });
        }

        if (!user.estado) {
            return res.status(400).json({
                msg: "Error: El usuario no está activo en la base de datos."
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Error: La contraseña ingresada es incorrecta."
            });
        }

        const token = await generarJWT(user.id);

        res.status(200).json({
            msg: "Inicio de sesión exitoso. Has accedido correctamente.",
            userDetails: {
                username: user.username,
                token: token
            }
        });

    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({
            msg: "Error en el servidor. Se ha producido un fallo inesperado.",
            error: error.message
        });
    }
};

export const register = async (req, res) => {
    try {
        const data = req.body;

        if (data.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "Acceso denegado. No tienes permisos para registrarte como administrador."
            });
        }

        const encryptedPassword = await hash(data.password);

        const user = await Usuario.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword,
            role: data.role || "USER_ROLE"
        });

        return res.status(201).json({
            message: "Registro exitoso. Usuario creado correctamente.",
            userDetails: {
                user: user.email
            }
        });

    } catch (error) {
        console.error("Error en el registro:", error);
        return res.status(500).json({
            message: "Error en el registro. No se pudo completar el proceso.",
            error: error.message
        });
    }
};
