import userRepository from "../repositories/userRepository.js";
import cartRepository from "../repositories/cartRepository.js";
import passwordResetDAO from "../dao/passwordResetDAO.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import emailService from "./emailService.js";
import crypto from "crypto";

class AuthService {
  async register(userData) {
    // Verificar si el usuario ya existe
    const existingUser = await userRepository.userExists(userData.email);
    if (existingUser) {
      throw new Error("El usuario ya existe");
    }

    // Crear el usuario
    const newUser = await userRepository.createUser(userData);

    // Crear carrito para el usuario
    const cart = await cartRepository.createCart(newUser._id);
    
    // Asignar carrito al usuario
    await userRepository.assignCart(newUser._id, cart._id);

    return newUser;
  }

  async login(email, password) {
    // Buscar usuario
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    // Validar contraseña
    if (!isValidPassword(user, password)) {
      throw new Error("Credenciales inválidas");
    }

    // Actualizar última conexión
    await userRepository.updateLastConnection(user._id);

    // Generar token
    const token = generateToken(user);

    return { user, token };
  }

  async requestPasswordReset(email) {
    // Buscar usuario
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Eliminar tokens anteriores del usuario
    await passwordResetDAO.deleteByUserId(user._id);

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Guardar token en la base de datos
    await passwordResetDAO.create(user._id, resetToken);

    // Enviar email
    await emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: "Correo de recuperación enviado" };
  }

  async resetPassword(token, newPassword) {
    // Buscar token válido
    const resetRecord = await passwordResetDAO.findByToken(token);
    
    if (!resetRecord) {
      throw new Error("Token inválido o expirado");
    }

    // Verificar que la nueva contraseña no sea igual a la anterior
    const user = resetRecord.user;
    if (isValidPassword(user, newPassword)) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }

    // Actualizar contraseña
    await userRepository.updateUser(user._id, { password: newPassword });

    // Marcar token como usado
    await passwordResetDAO.markAsUsed(token);

    return { message: "Contraseña actualizada correctamente" };
  }

  async validateResetToken(token) {
    const resetRecord = await passwordResetDAO.findByToken(token);
    return !!resetRecord;
  }
}

export default new AuthService();