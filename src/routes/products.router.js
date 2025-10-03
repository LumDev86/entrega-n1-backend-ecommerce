import { Router } from "express";
import productController from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/authorization.js";

const router = Router();

// Rutas públicas (ver productos)
router.get("/", productController.getAllProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:id", productController.getProductById);

// Rutas protegidas - Solo admin puede crear, actualizar y eliminar
router.post("/", authMiddleware, isAdmin, productController.createProduct);
router.put("/:id", authMiddleware, isAdmin, productController.updateProduct);
router.delete("/:id", authMiddleware, isAdmin, productController.deleteProduct);

export default router;