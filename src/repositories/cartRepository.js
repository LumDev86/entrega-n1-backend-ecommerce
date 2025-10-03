import cartDAO from "../dao/cartDAO.js";

class CartRepository {
    async createCart(userId) {
        return await cartDAO.create(userId);
    }

    async getCartById(id) {
        return await cartDAO.findById(id);
    }

    async getCartByUserId(userId) {
        return await cartDAO.findByUserId(userId);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await cartDAO.addProduct(cartId, productId, quantity);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await cartDAO.updateProductQuantity(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        return await cartDAO.removeProduct(cartId, productId);
    }

    async clearCart(cartId) {
        return await cartDAO.clearCart(cartId);
    }

    async deleteCart(id) {
        return await cartDAO.delete(id);
    }
}

export default new CartRepository();