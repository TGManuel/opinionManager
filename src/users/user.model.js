import { Schema,model } from "mongoose";

const UserSchema = Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: [true, 'El email es indispensable'],
        unique: true
    },
    password:{
        type: String, 
        required: [true, 'El password es indispensable']
    },
    role:{
        type: String,
        required: [true, 'El rol es indispensale'],
        enum: ['ADMIN_ROLE','USER_ROLE'],
        default: 'USER_ROLE'
    },
    estado:{
        type:Boolean,
        default: true,
        required:true
    }

})

UserSchema.methods.toJson = function () {
    const {_v,password,_id,...user} = this.toObject()
    user.uid = _id
    return user
}

export default model('User', UserSchema)