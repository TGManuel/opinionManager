import User from "../users/user.model.js";
import Post from "../post/post.model.js";
import Comment from "../comment/comment.model.js";

export const saveComment = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findById(req.usuario._id); 
        const post = await Post.findById(data.postId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Error: Usuario no encontrado."
            });
        }

        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Error: Publicación no encontrada."
            });
        }

        const comment = new Comment({
            content: data.content,
            keeperUser: user._id,
            keeperPost: post._id,
            status: true
        });

        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comentario creado: El comentario se ha creado correctamente.",
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al guardar el comentario: No se pudo guardar el comentario.",
            error
        });
    }
}

export const getComments = async(req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {status: true};
    try {
        const comments = await Comment.find(query)
            .skip(Number(desde))
            .limit(Number(limite));
            
        const commentsWithOwnerNames =  await Promise.all(comments.map(async (comment) =>{
            const owner = await User.findById(comment.keeperUser);
            const post = await Post.findById(comment.keeperPost)
            return{
                ...comment.toObject(),
                keeperUser: owner ? owner.nombre : "Error: Usuario no encontrado.",
                keeperPost: post ? post.title : "Error: Publicación no encontrada."
            }
        }));
        
        const total = await Comment.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            comments: commentsWithOwnerNames
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el comentario: No se pudo recuperar el comentario.",
            error
        })
    }
}

export const searchComment = async (req, res) =>{
    const {id} = req.params;

    try {
        const comment = await Comment.findById(id);

        if(!comment){
            return res.status(404).json({
                success: false,
                message: "Error: Comentario no encontrado."
            })
        }

        const owner = await User.findById(comment.keeperUser);

        res.status(200).json({
            success: true,
            comment: {
                ...comment.toObject(),
                keeperUser: owner ? owner.name : "Error: Creador no encontrado."
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar el comentario: No se pudo realizar la búsqueda.",
            error
        })
    }
}

export const deleteComment = async(req, res) => {
    const {id} = req.params;
    try {

        const comment = await Comment.findByIdAndUpdate(id, { status: false });        

        if (req.usuario.role === "USER_ROLE" && comment.keeperUser.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "Error: No autorizado para modificar este comentario." 
            });
        }
        
        if (!comment) {
            return res.status(404).json({
                 success: false, 
                 msg: "Error: Comentario no encontrado." 
            });
        }

        res.status(200).json({
            success: true,
            message: "Comentario eliminado exitosamente."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el comentario: No se pudo eliminar el comentario.",
            error
        })
    }

}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, keeper, ...data } = req.body; 

        const comment = await Comment.findByIdAndUpdate(id, data, { new: true });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Error: Comentario no encontrado."
            });
        }

        if (req.usuario.role === "USER_ROLE" && comment.keeperUser.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                msg: "Error: No autorizado para modificar este comentario." 
            });
        }

        res.status(200).json({
            success: true,
            msg: "Comentario actualizado correctamente.",
            comment
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el comentario: No se pudo actualizar el comentario.",
            error
        });
    }
}
