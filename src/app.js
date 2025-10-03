import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import { initializePassport } from "./config/passport.config.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

// Rutas
import sessionsRouter from "./routes/sessions.router.js";
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

dotenv.config();

const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    message: "Ecommerce Backend API",
    version: "2.0.0",
    endpoints: {
      sessions: "/api/sessions",
      users: "/api/users",
      products: "/api/products",
      carts: "/api/carts"
    }
  });
});

// Middleware de manejo de errores
app.use(notFound);
app.use(errorHandler);

// Conexión a DB + Servidor
const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB conectado correctamente");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => console.error("Error de conexión a DB:", err));

export default app;
