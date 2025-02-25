import mongoose from "mongoose";

const RolSchema = mongoose.Schema({
    role:{
        type: String,
        required: [true, 'El rol es obligatorio']
    }
})

export default mongoose.model('Role', RolSchema)