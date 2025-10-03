import authService from "../services/authService.js";
import userService from "../services/userService.js";
import { UserAuthDTO } from "../dto/userDTO.js";

class SessionController {
    async register(req, res, next) {
        try {
        const userData = req.body;
        const newUser = await authService.register(userData);
        
        res.status(201).json({
            status: "success",
            message: "Usuario registrado correctamente",
            user: new UserAuthDTO(newUser)
        });
        } catch (error) {
        next(error);
        }
    }

    async login(req, res, next) {
        try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
            status: "error",
            error: "Email y contraseña son requeridos"
            });
        }

        const { user, token } = await authService.login(email, password);

        res.json({
            status: "success",
            message: "Inicio de sesión exitoso",
            token,
            user: new UserAuthDTO(user)
        });
        } catch (error) {
        next(error);
        }
    }

    async current(req, res, next) {
        try {
        // req.user viene del middleware de autenticación
        const user = await userService.getCurrentUser(req.user._id);
        
        res.json({
            status: "success",
            user
        });
        } catch (error) {
        next(error);
        }
    }

    async requestPasswordReset(req, res, next) {
        try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
            status: "error",
            error: "Email es requerido"
            });
        }

        await authService.requestPasswordReset(email);

        res.json({
            status: "success",
            message: "Si el email existe, recibirás un correo para restablecer tu contraseña"
        });
        } catch (error) {
        // Por seguridad, no revelamos si el email existe o no
        res.json({
            status: "success",
            message: "Si el email existe, recibirás un correo para restablecer tu contraseña"
        });
        }
    }

    async resetPassword(req, res, next) {
        try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
            status: "error",
            error: "Token y nueva contraseña son requeridos"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
            status: "error",
            error: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        await authService.resetPassword(token, newPassword);

        res.json({
            status: "success",
            message: "Contraseña actualizada correctamente"
        });
        } catch (error) {
        next(error);
        }
    }

    async validateResetToken(req, res, next) {
        try {
        const { token } = req.params;

        const isValid = await authService.validateResetToken(token);

        res.json({
            status: "success",
            valid: isValid
        });
        } catch (error) {
        next(error);
        }
    }

    async logout(req, res) {
        // En JWT no hay logout del lado del servidor
        // El cliente debe eliminar el token
        res.json({
        status: "success",
        message: "Sesión cerrada correctamente"
        });
    }
}

export default new SessionController();