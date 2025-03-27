import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "[Console] Error: El título es obligatorio."]
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "[Console] Error: La categoría es obligatoria."]
        },
        content: {
            type: String,
            required: [true, "[Console] Error: El contenido es obligatorio."]
        },
        keeper: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "[Console] Error: El usuario creador es obligatorio."]
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model("Post", PostSchema);
