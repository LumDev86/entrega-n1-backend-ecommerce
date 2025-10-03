import userService from "../services/userService.js";

class UserController {
    async getAllUsers(req, res, next) {
        try {
        const users = await userService.getAllUsers();
        
        res.json({
            status: "success",
            users
        });
        } catch (error) {
        next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
        const { id } = req.params;
        const user = await userService.getUserById(id);

        res.json({
            status: "success",
            user
        });
        } catch (error) {
        next(error);
        }
    }

    async createUser(req, res, next) {
        try {
        const userData = req.body;
        const newUser = await userService.createUser(userData);

        res.status(201).json({
            status: "success",
            message: "Usuario creado correctamente",
            user: newUser
        });
        } catch (error) {
        next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedUser = await userService.updateUser(id, updateData);

        res.json({
            status: "success",
            message: "Usuario actualizado correctamente",
            user: updatedUser
        });
        } catch (error) {
        next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
        const { id } = req.params;
        await userService.deleteUser(id);

        res.json({
            status: "success",
            message: "Usuario eliminado correctamente"
        });
        } catch (error) {
        next(error);
        }
    }
}

export default new UserController();