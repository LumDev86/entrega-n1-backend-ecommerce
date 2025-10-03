import Product from "../models/productModel.js";

class ProductDAO {
    async create(productData) {
        return await Product.create(productData);
    }

    async findById(id) {
        return await Product.findById(id).populate("owner", "email first_name last_name");
    }

    async findByCode(code) {
        return await Product.findOne({ code });
    }

    async findAll(filter = {}) {
        return await Product.find(filter).populate("owner", "email first_name last_name");
    }

    async update(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
        });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }

    async exists(code) {
        return await Product.exists({ code });
    }

    async updateStock(id, quantity) {
        return await Product.findByIdAndUpdate(
        id,
        { $inc: { stock: quantity } },
        { new: true }
        );
    }

    async findByCategory(category) {
        return await Product.find({ category, status: true });
    }
}

export default new ProductDAO();