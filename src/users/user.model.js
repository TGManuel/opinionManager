import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String
    }

})