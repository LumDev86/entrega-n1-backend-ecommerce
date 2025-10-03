import cartService from "../services/cartService.js";
import ticketService from "../services/ticketService.js";

class CartController {
    async getCart(req, res, next) {
        try {
        const userId = req.user._id;
        const cart = await cartService.getCartByUserId(userId);

        res.json({
            status: "success",
            cart
        });
        } catch (error) {
        next(error);
        }
    }

    async addProduct(req, res, next) {
        try {
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            return res.status(400).json({
            status: "error",
            error: "productId es requerido"
            });
        }

        const cart = await cartService.addProductToCart(userId, productId, quantity);

        res.json({
            status: "success",
            message: "Producto agregado al carrito",
            cart
        });
        } catch (error) {
        next(error);
        }
    }

    async updateProductQuantity(req, res, next) {
        try {
        const userId = req.user._id;
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
            status: "error",
            error: "La cantidad debe ser mayor a 0"
            });
        }

        const cart = await cartService.updateProductQuantity(userId, productId, quantity);

        res.json({
            status: "success",
            message: "Cantidad actualizada",
            cart
        });
        } catch (error) {
        next(error);
        }
    }

    async removeProduct(req, res, next) {
        try {
        const userId = req.user._id;
        const { productId } = req.params;

        const cart = await cartService.removeProductFromCart(userId, productId);

        res.json({
            status: "success",
            message: "Producto eliminado del carrito",
            cart
        });
        } catch (error) {
        next(error);
        }
    }

    async clearCart(req, res, next) {
        try {
        const userId = req.user._id;
        await cartService.clearCart(userId);

        res.json({
            status: "success",
            message: "Carrito vaciado correctamente"
        });
        } catch (error) {
        next(error);
        }
    }

    async purchase(req, res, next) {
        try {
        const userId = req.user._id;
        const result = await ticketService.processPurchase(userId);

        if (!result.success) {
            return res.status(400).json({
            status: "error",
            ...result
            });
        }

        res.json({
            status: "success",
            ...result
        });
        } catch (error) {
        next(error);
        }
    }

    async getMyTickets(req, res, next) {
        try {
        const userEmail = req.user.email;
        const tickets = await ticketService.getUserTickets(userEmail);

        res.json({
            status: "success",
            count: tickets.length,
            tickets
        });
        } catch (error) {
        next(error);
        }
    }

    async getTicketById(req, res, next) {
        try {
        const { ticketId } = req.params;
        const ticket = await ticketService.getTicketById(ticketId);

        // Verificar que el ticket pertenece al usuario
        if (ticket.purchaser !== req.user.email && req.user.role !== "admin") {
            return res.status(403).json({
            status: "error",
            error: "No tienes permiso para ver este ticket"
            });
        }

        res.json({
            status: "success",
            ticket
        });
        } catch (error) {
        next(error);
        }
    }
}

export default new CartController();