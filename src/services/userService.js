import userRepository from "../repositories/userRepository.js";
import { UserDTO, UserPublicDTO } from "../dto/userDTO.js";

class UserService {
    async getAllUsers() {
        const users = await userRepository.getAllUsers();
        return users.map(user => new UserPublicDTO(user));
    }

    async getUserById(id) {
        const user = await userRepository.getUserById(id);
        if (!user) {
        throw new Error("Usuario no encontrado");
        }
        return new UserDTO(user);
    }

    async createUser(userData) {
        const exists = await userRepository.userExists(userData.email);
        if (exists) {
        throw new Error("El usuario ya existe");
        }
        
        const newUser = await userRepository.createUser(userData);
        return new UserDTO(newUser);
    }

    async updateUser(id, updateData) {
        const user = await userRepository.getUserById(id);
        if (!user) {
        throw new Error("Usuario no encontrado");
        }

        const updatedUser = await userRepository.updateUser(id, updateData);
        return new UserDTO(updatedUser);
    }

    async deleteUser(id) {
        const user = await userRepository.getUserById(id);
        if (!user) {
        throw new Error("Usuario no encontrado");
        }

        await userRepository.deleteUser(id);
        return { message: "Usuario eliminado correctamente" };
    }

    async getCurrentUser(userId) {
        const user = await userRepository.getUserById(userId);
        if (!user) {
        throw new Error("Usuario no encontrado");
        }
        return new UserDTO(user);
    }
}

export default new UserService();