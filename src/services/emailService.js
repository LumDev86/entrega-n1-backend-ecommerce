import transporter from "../config/nodemailer.config.js";
import dotenv from "dotenv";

dotenv.config();

class EmailService {
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperación de Contraseña - Ecommerce",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #007bff; 
              color: #ffffff !important; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .warning { color: #856404; background-color: #fff3cd; padding: 10px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Recuperación de Contraseña</h2>
            <p>Has solicitado restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este enlace expirará en <strong>1 hora</strong></li>
                <li>Si no solicitaste este cambio, ignora este correo</li>
                <li>No compartas este enlace con nadie</li>
              </ul>
            </div>
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email enviado:", info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error enviando email:", error);
      throw new Error("No se pudo enviar el correo de recuperación");
    }
  }

  async sendPurchaseConfirmation(email, ticket) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Confirmación de Compra - Ticket ${ticket.code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .ticket { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .total { font-size: 1.5em; font-weight: bold; color: #28a745; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #007bff; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>¡Gracias por tu compra!</h2>
            <div class="ticket">
              <h3>Detalles del Ticket</h3>
              <p><strong>Código:</strong> ${ticket.code}</p>
              <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
              <p><strong>Estado:</strong> ${ticket.status === 'completed' ? 'Completada' : 'Parcial'}</p>
            </div>
            <h3>Productos Comprados</h3>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${ticket.products.map(item => `
                  <tr>
                    <td>${item.product.title}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price}</td>
                    <td>$${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p class="total">Total: $${ticket.amount.toFixed(2)}</p>
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          </div>
        </body>
        </html>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("Error enviando email de confirmación:", error);
      throw new Error("No se pudo enviar el correo de confirmación");
    }
  }
}

export default new EmailService();