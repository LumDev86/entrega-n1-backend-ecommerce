import { Router } from "express";
import sessionController from "../controllers/sessionController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Rutas públicas
router.post("/register", sessionController.register);
router.post("/login", sessionController.login);
router.post("/request-password-reset", sessionController.requestPasswordReset);
router.post("/reset-password", sessionController.resetPassword);
router.get("/validate-reset-token/:token", sessionController.validateResetToken);

// Rutas protegidas
router.get("/current", authMiddleware, sessionController.current);
router.post("/logout", authMiddleware, sessionController.logout);

export default router;