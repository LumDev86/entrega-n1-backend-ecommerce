import User from "../models/userModel.js";

class UserDAO {
    async create(userData) {
        return await User.create(userData);
    }

    async findById(id) {
        return await User.findById(id).populate("cart");
    }

    async findByEmail(email) {
        return await User.findOne({ email }).populate("cart");
    }

    async findAll() {
        return await User.find().populate("cart");
    }

    async update(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
        }).populate("cart");
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }

    async exists(email) {
        return await User.exists({ email });
    }

    async updateLastConnection(id) {
        return await User.findByIdAndUpdate(
        id,
        { lastConnection: new Date() },
        { new: true }
        );
    }
}

export default new UserDAO();