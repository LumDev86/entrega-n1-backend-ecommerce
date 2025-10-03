import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configuración del transportador de correo
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verificar conexión
transporter.verify((error, success) => {
  if (error) {
    console.error("Error en configuración de email:", error);
  } else {
    console.log("Servidor de email listo para enviar mensajes");
  }
});

export default transporter;