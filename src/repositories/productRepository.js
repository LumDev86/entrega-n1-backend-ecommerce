import productDAO from "../dao/productDAO.js";

class ProductRepository {
    async createProduct(productData) {
        return await productDAO.create(productData);
    }

    async getProductById(id) {
        return await productDAO.findById(id);
    }

    async getProductByCode(code) {
        return await productDAO.findByCode(code);
    }

    async getAllProducts(filter = {}) {
        return await productDAO.findAll(filter);
    }

    async updateProduct(id, updateData) {
        return await productDAO.update(id, updateData);
    }

    async deleteProduct(id) {
        return await productDAO.delete(id);
    }

    async productExists(code) {
        return await productDAO.exists(code);
    }

    async updateStock(id, quantity) {
        return await productDAO.updateStock(id, quantity);
    }

    async getProductsByCategory(category) {
        return await productDAO.findByCategory(category);
    }

    async decreaseStock(id, quantity) {
        return await productDAO.updateStock(id, -quantity);
    }

    async increaseStock(id, quantity) {
        return await productDAO.updateStock(id, quantity);
    }
}

export default new ProductRepository();