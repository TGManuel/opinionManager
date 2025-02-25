import Role from "../role/role.model.js"
import User from "../users/user.model.js"

export const isValidRole = async (role="") => {
    const existentRole = await Role.findOne({role})

    if(!existentRole){
        throw new Error('El rol ${role} no existe')
    }
}

export const isValidEmail = async (email="") => {
    const existentEmail = await User.findOne({email})

    if(existentEmail){
        throw new Error('El email ${email} ya existe en el sistema')
    }
}

export const existentUserById = async (id="") => {
    const existentUser = await User.findOne(id)

    if(!existentUser){
        throw new Error('El id ${id} no existe')
    }
    
}