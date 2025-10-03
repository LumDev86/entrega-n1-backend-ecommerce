import Ticket from "../models/ticketModel.js";

class TicketDAO {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async findById(id) {
    return await Ticket.findById(id).populate("products.product");
  }

  async findByCode(code) {
    return await Ticket.findOne({ code }).populate("products.product");
  }

  async findByPurchaser(purchaser) {
    return await Ticket.find({ purchaser }).populate("products.product");
  }

  async findAll() {
    return await Ticket.find().populate("products.product");
  }

  async generateUniqueCode() {
    let code;
    let exists = true;

    while (exists) {
      code = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      exists = await Ticket.exists({ code });
    }

    return code;
  }
}

export default new TicketDAO();