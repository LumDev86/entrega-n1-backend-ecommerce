import { Router } from "express";
import User from "../models/userModel.js";
import { createHash } from "../utils/bcrypt.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("cart");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("cart");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "El usuario ya existe" });

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role
    });

    res.status(201).json({ message: "Usuario creado correctamente", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un usuario
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = createHash(updates.password);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true
    });

    if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario actualizado", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un usuario
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
