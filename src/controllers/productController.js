import productService from "../services/productService.js";

class ProductController {
    async getAllProducts(req, res, next) {
        try {
        const { category, status } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (status !== undefined) filter.status = status === "true";

        const products = await productService.getAllProducts(filter);

        res.json({
            status: "success",
            count: products.length,
            products
        });
        } catch (error) {
        next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
        const { id } = req.params;
        const product = await productService.getProductById(id);

        res.json({
            status: "success",
            product
        });
        } catch (error) {
        next(error);
        }
    }

    async createProduct(req, res, next) {
        try {
        const productData = req.body;
        const ownerId = req.user._id;

        const newProduct = await productService.createProduct(productData, ownerId);

        res.status(201).json({
            status: "success",
            message: "Producto creado correctamente",
            product: newProduct
        });
        } catch (error) {
        next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
        const { id } = req.params;
        const updateData = req.body;
        const userId = req.user._id.toString();
        const userRole = req.user.role;

        const updatedProduct = await productService.updateProduct(
            id,
            updateData,
            userId,
            userRole
        );

        res.json({
            status: "success",
            message: "Producto actualizado correctamente",
            product: updatedProduct
        });
        } catch (error) {
        next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
        const { id } = req.params;
        const userId = req.user._id.toString();
        const userRole = req.user.role;

        await productService.deleteProduct(id, userId, userRole);

        res.json({
            status: "success",
            message: "Producto eliminado correctamente"
        });
        } catch (error) {
        next(error);
        }
    }

    async getProductsByCategory(req, res, next) {
        try {
        const { category } = req.params;
        const products = await productService.getProductsByCategory(category);

        res.json({
            status: "success",
            count: products.length,
            products
        });
        } catch (error) {
        next(error);
        }
    }
}

export default new ProductController();