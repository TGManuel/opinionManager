import jwt from "jsonwebtoken"

export const generateJWT = (uid='') =>{
    const payload = {uid} 

    jwt.sign(
        payload,
        process.env.SECRETPRIVATEKEY,
        {
            expiresIn: '5h'
        },
        (err,token) => {
            err ? (console.log(err),reject('No se generó el token correctamente')) : resolve(token)
        }
    )
}