import cartRepository from "../repositories/cartRepository.js";
import productRepository from "../repositories/productRepository.js";
import userRepository from "../repositories/userRepository.js";

class CartService {
    async getCartByUserId(userId) {
        const user = await userRepository.getUserById(userId);
        if (!user.cart) {
        throw new Error("El usuario no tiene un carrito asignado");
        }

        const cart = await cartRepository.getCartById(user.cart);
        if (!cart) {
        throw new Error("Carrito no encontrado");
        }

        return cart;
    }

    async addProductToCart(userId, productId, quantity = 1) {
        // Verificar que el producto existe y tiene stock
        const product = await productRepository.getProductById(productId);
        if (!product) {
        throw new Error("Producto no encontrado");
        }

        if (product.stock < quantity) {
        throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
        }

        // Obtener carrito del usuario
        const user = await userRepository.getUserById(userId);
        if (!user.cart) {
        throw new Error("El usuario no tiene un carrito asignado");
        }

        // Agregar producto al carrito
        const updatedCart = await cartRepository.addProductToCart(
        user.cart,
        productId,
        quantity
        );

        return await cartRepository.getCartById(updatedCart._id);
    }

    async updateProductQuantity(userId, productId, quantity) {
        // Verificar stock disponible
        const product = await productRepository.getProductById(productId);
        if (!product) {
        throw new Error("Producto no encontrado");
        }

        if (product.stock < quantity) {
        throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
        }

        // Obtener carrito del usuario
        const user = await userRepository.getUserById(userId);
        if (!user.cart) {
        throw new Error("El usuario no tiene un carrito asignado");
        }

        const updatedCart = await cartRepository.updateProductQuantity(
        user.cart,
        productId,
        quantity
        );

        return updatedCart;
    }

    async removeProductFromCart(userId, productId) {
        const user = await userRepository.getUserById(userId);
        if (!user.cart) {
        throw new Error("El usuario no tiene un carrito asignado");
        }

        const updatedCart = await cartRepository.removeProductFromCart(
        user.cart,
        productId
        );

        return updatedCart;
    }

    async clearCart(userId) {
        const user = await userRepository.getUserById(userId);
        if (!user.cart) {
        throw new Error("El usuario no tiene un carrito asignado");
        }

        await cartRepository.clearCart(user.cart);
        return { message: "Carrito vaciado correctamente" };
    }
}

export default new CartService();