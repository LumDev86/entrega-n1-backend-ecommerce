// DTO para ticket de compra
export class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id;
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.status = ticket.status;
    this.products = ticket.products.map(item => ({
      product: {
        id: item.product._id,
        title: item.product.title,
        code: item.product.code
      },
      quantity: item.quantity,
      price: item.price
    }));
  }
}

// DTO para listado de tickets
export class TicketListDTO {
  constructor(ticket) {
    this.id = ticket._id;
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.status = ticket.status;
  }
}