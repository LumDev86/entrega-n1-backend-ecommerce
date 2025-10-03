import { Router } from "express";
import cartController from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorization.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de carrito - Solo usuarios regulares
router.get("/", authorize("user"), cartController.getCart);
router.post("/products", authorize("user"), cartController.addProduct);
router.put("/products/:productId", authorize("user"), cartController.updateProductQuantity);
router.delete("/products/:productId", authorize("user"), cartController.removeProduct);
router.delete("/", authorize("user"), cartController.clearCart);

// Ruta de compra - Solo usuarios regulares
router.post("/purchase", authorize("user"), cartController.purchase);

// Rutas de tickets
router.get("/tickets", authorize("user"), cartController.getMyTickets);
router.get("/tickets/:ticketId", authorize("user"), cartController.getTicketById);

export default router;