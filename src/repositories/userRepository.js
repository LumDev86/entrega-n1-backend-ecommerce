import userDAO from "../dao/userDAO.js";
import { createHash } from "../utils/bcrypt.js";

class UserRepository {
    async createUser(userData) {
        if (userData.password) {
        userData.password = createHash(userData.password);
        }
        return await userDAO.create(userData);
    }

    async getUserById(id) {
        return await userDAO.findById(id);
    }

    async getUserByEmail(email) {
        return await userDAO.findByEmail(email);
    }

    async getAllUsers() {
        return await userDAO.findAll();
    }

    async updateUser(id, updateData) {
        if (updateData.password) {
        updateData.password = createHash(updateData.password);
        }
        return await userDAO.update(id, updateData);
    }

    async deleteUser(id) {
        return await userDAO.delete(id);
    }

    async userExists(email) {
        return await userDAO.exists(email);
    }

    async updateLastConnection(id) {
        return await userDAO.updateLastConnection(id);
    }

    async assignCart(userId, cartId) {
        return await userDAO.update(userId, { cart: cartId });
    }
}

export default new UserRepository();