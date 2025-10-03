import ticketDAO from "../dao/ticketDAO.js";

class TicketRepository {
  async createTicket(ticketData) {
    return await ticketDAO.create(ticketData);
  }

  async getTicketById(id) {
    return await ticketDAO.findById(id);
  }

  async getTicketByCode(code) {
    return await ticketDAO.findByCode(code);
  }

  async getTicketsByPurchaser(purchaser) {
    return await ticketDAO.findByPurchaser(purchaser);
  }

  async getAllTickets() {
    return await ticketDAO.findAll();
  }

  async generateUniqueCode() {
    return await ticketDAO.generateUniqueCode();
  }
}

export default new TicketRepository();