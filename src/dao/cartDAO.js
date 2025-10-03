import Cart from "../models/cartModel.js";

class CartDAO {
  async create(userId) {
    return await Cart.create({ user: userId, products: [] });
  }

  async findById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async findByUserId(userId) {
    return await Cart.findOne({ user: userId }).populate("products.product");
  }

  async addProduct(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    const existingProduct = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cart.save();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await Cart.findOneAndUpdate(
      { _id: cartId, "products.product": productId },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    ).populate("products.product");
  }

  async removeProduct(cartId, productId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate("products.product");
  }

  async clearCart(cartId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { $set: { products: [] } },
      { new: true }
    );
  }

  async delete(id) {
    return await Cart.findByIdAndDelete(id);
  }
}

export default new CartDAO();