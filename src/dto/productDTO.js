// DTO para producto público
export class ProductDTO {
  constructor(product) {
    this.id = product._id;
    this.title = product.title;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price;
    this.status = product.status;
    this.stock = product.stock;
    this.category = product.category;
    this.thumbnails = product.thumbnails;
    this.owner = product.owner ? {
      id: product.owner._id,
      email: product.owner.email
    } : null;
  }
}

// DTO para listado simple de productos
export class ProductListDTO {
  constructor(product) {
    this.id = product._id;
    this.title = product.title;
    this.price = product.price;
    this.stock = product.stock;
    this.category = product.category;
    this.status = product.status;
  }
}