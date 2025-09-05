import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import dotenv from "dotenv";
import { initializePassport } from "./config/passport.config.js";
import sessionsRouter from "./routes/sessions.router.js";
import userRouter from "./routes/users.router.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use("/api/sessions", sessionsRouter);
app.use("/api/users", userRouter);

// DB + Server
const PORT = process.env.PORT || 8080;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB Error:", err));

