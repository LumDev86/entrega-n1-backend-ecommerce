import productRepository from "../repositories/productRepository.js";
import { ProductDTO, ProductListDTO } from "../dto/productDTO.js";

class ProductService {
  async getAllProducts(filter = {}) {
    const products = await productRepository.getAllProducts(filter);
    return products.map(product => new ProductListDTO(product));
  }

  async getProductById(id) {
    const product = await productRepository.getProductById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return new ProductDTO(product);
  }

  async createProduct(productData, ownerId) {
    // Verificar si el código ya existe
    const exists = await productRepository.productExists(productData.code);
    if (exists) {
      throw new Error("Ya existe un producto con ese código");
    }

    // Asignar el owner (usuario que crea el producto)
    productData.owner = ownerId;

    const newProduct = await productRepository.createProduct(productData);
    return new ProductDTO(newProduct);
  }

  async updateProduct(id, updateData, userId, userRole) {
    const product = await productRepository.getProductById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    // Solo el admin o el owner del producto pueden actualizarlo
    if (userRole !== "admin" && product.owner._id.toString() !== userId) {
      throw new Error("No tienes permiso para actualizar este producto");
    }

    const updatedProduct = await productRepository.updateProduct(id, updateData);
    return new ProductDTO(updatedProduct);
  }

  async deleteProduct(id, userId, userRole) {
    const product = await productRepository.getProductById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    // Solo el admin o el owner del producto pueden eliminarlo
    if (userRole !== "admin" && product.owner._id.toString() !== userId) {
      throw new Error("No tienes permiso para eliminar este producto");
    }

    await productRepository.deleteProduct(id);
    return { message: "Producto eliminado correctamente" };
  }

  async getProductsByCategory(category) {
    const products = await productRepository.getProductsByCategory(category);
    return products.map(product => new ProductListDTO(product));
  }

  async checkStock(productId, quantity) {
    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product.stock >= quantity;
  }
}

export default new ProductService();