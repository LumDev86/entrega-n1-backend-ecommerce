import { Router } from "express";
import User from "../models/userModel.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "El usuario ya existe" });

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password)
    });

    res.status(201).json({ message: "Usuario registrado correctamente", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Credenciales Invalidas" });

    if (!isValidPassword(user, password))
      return res.status(401).json({ message: "Credenciales invalidas" });

    const token = generateToken(user);

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Current
router.get("/current", authMiddleware, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    first_name: req.user.first_name,
    last_name: req.user.last_name
  });
});

export default router;
