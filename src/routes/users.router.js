import { Router } from "express";
import userController from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/authorization.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Solo admin puede acceder a estas rutas
router.get("/", isAdmin, userController.getAllUsers);
router.get("/:id", isAdmin, userController.getUserById);
router.post("/", isAdmin, userController.createUser);
router.put("/:id", isAdmin, userController.updateUser);
router.delete("/:id", isAdmin, userController.deleteUser);

export default router;