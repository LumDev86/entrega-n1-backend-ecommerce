import ticketRepository from "../repositories/ticketRepository.js";
import cartRepository from "../repositories/cartRepository.js";
import productRepository from "../repositories/productRepository.js";
import userRepository from "../repositories/userRepository.js";
import emailService from "./emailService.js";
import { TicketDTO } from "../dto/ticketDTO.js";

class TicketService {
  async processPurchase(userId) {
    // Obtener usuario y carrito
    const user = await userRepository.getUserById(userId);
    if (!user.cart) {
      throw new Error("El usuario no tiene un carrito asignado");
    }

    const cart = await cartRepository.getCartById(user.cart);
    if (!cart || cart.products.length === 0) {
      throw new Error("El carrito está vacío");
    }

    // Arrays para productos comprados y no comprados
    const purchasedProducts = [];
    const failedProducts = [];
    let totalAmount = 0;

    // Procesar cada producto del carrito
    for (const item of cart.products) {
      const product = await productRepository.getProductById(item.product._id);

      if (!product) {
        failedProducts.push({
          productId: item.product._id,
          reason: "Producto no encontrado"
        });
        continue;
      }

      // Verificar stock
      if (product.stock >= item.quantity) {
        // Hay stock suficiente
        purchasedProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price
        });

        totalAmount += product.price * item.quantity;

        // Descontar stock
        await productRepository.decreaseStock(product._id, item.quantity);
      } else {
        // Stock insuficiente
        failedProducts.push({
          productId: product._id,
          title: product.title,
          requested: item.quantity,
          available: product.stock,
          reason: "Stock insuficiente"
        });
      }
    }

    // Si no se pudo comprar ningún producto
    if (purchasedProducts.length === 0) {
      return {
        success: false,
        message: "No se pudo procesar ningún producto",
        failedProducts
      };
    }

    // Generar código único para el ticket
    const ticketCode = await ticketRepository.generateUniqueCode();

    // Crear ticket
    const ticketData = {
      code: ticketCode,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: user.email,
      products: purchasedProducts,
      status: failedProducts.length > 0 ? "partial" : "completed"
    };

    const ticket = await ticketRepository.createTicket(ticketData);

    // Limpiar del carrito solo los productos comprados
    for (const item of purchasedProducts) {
      await cartRepository.removeProductFromCart(user.cart, item.product);
    }

    // Obtener ticket completo con populate
    const fullTicket = await ticketRepository.getTicketById(ticket._id);

    // Enviar email de confirmación
    try {
      await emailService.sendPurchaseConfirmation(user.email, fullTicket);
    } catch (emailError) {
      console.error("Error enviando email de confirmación:", emailError);
      // No bloqueamos la compra si falla el email
    }

    return {
      success: true,
      ticket: new TicketDTO(fullTicket),
      failedProducts: failedProducts.length > 0 ? failedProducts : undefined,
      message: failedProducts.length > 0 
        ? "Compra procesada parcialmente. Algunos productos no pudieron ser comprados."
        : "Compra procesada exitosamente"
    };
  }

  async getTicketById(id) {
    const ticket = await ticketRepository.getTicketById(id);
    if (!ticket) {
      throw new Error("Ticket no encontrado");
    }
    return new TicketDTO(ticket);
  }

  async getUserTickets(email) {
    const tickets = await ticketRepository.getTicketsByPurchaser(email);
    return tickets.map(ticket => new TicketDTO(ticket));
  }

  async getAllTickets() {
    const tickets = await ticketRepository.getAllTickets();
    return tickets.map(ticket => new TicketDTO(ticket));
  }
}

export default new TicketService();