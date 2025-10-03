// Middleware global de manejo de errores
export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);

    // Error de validación de Mongoose
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
        error: "Error de validación",
        details: errors
        });
    }

    // Error de cast (ID inválido)
    if (err.name === "CastError") {
        return res.status(400).json({
        error: "ID inválido",
        details: err.message
        });
    }

    // Error de duplicado (unique constraint)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
        error: `El ${field} ya existe`,
        field
        });
    }

    // Error de JWT
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
        error: "Token inválido"
        });
    }

    // Error de JWT expirado
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
        error: "Token expirado"
        });
    }

    // Errores personalizados con statusCode
    if (err.statusCode) {
        return res.status(err.statusCode).json({
        error: err.message
        });
    }

    // Error genérico
    res.status(500).json({
        error: "Error interno del servidor",
        message: process.env.NODE_ENV === "development" ? err.message : undefined
    });
};

// Middleware para rutas no encontradas
export const notFound = (req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada",
        path: req.originalUrl
    });
};