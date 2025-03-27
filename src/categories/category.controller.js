import Category from "../categories/category.model.js";
import Post from "../post/post.model.js";

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();

        res.status(201).json({
            success: true,
            message: "Categoría creada exitosamente.",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear la categoría. Ocurrió un problema durante el proceso.",
            error
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: true });
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las categorías. No se pudieron recuperar.",
            error
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

        res.status(200).json({
            success: true,
            message: "Categoría actualizada correctamente.",
            category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la categoría. No se pudo completar el proceso.",
            error
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const defaultCategory = await Category.findOne({ name: "General" });
        if (!defaultCategory) {
            return res.status(500).json({
                success: false,
                message: "Error: No se encontró la categoría por defecto."
            });
        }

        await Post.updateMany({ category: id }, { category: defaultCategory._id });

        await Category.findByIdAndUpdate(id, { status: false });

        res.status(200).json({
            success: true,
            message: "Categoría eliminada correctamente. Las publicaciones han sido reasignadas."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la categoría. No se pudo completar la operación.",
            error: error.message
        });
    }
};
