// Middleware para verificar roles específicos
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: "No autenticado" 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: "No tienes permisos para acceder a este recurso",
        requiredRole: allowedRoles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

// Middleware específico para admin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      error: "Acceso denegado. Se requieren privilegios de administrador" 
    });
  }

  next();
};

// Middleware específico para usuarios regulares
export const isUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (req.user.role !== "user") {
    return res.status(403).json({ 
      error: "Este recurso es solo para usuarios regulares" 
    });
  }

  next();
};

// Middleware para verificar que el usuario es el owner del recurso
export const isOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const userId = req.params.id || req.params.userId;
  
  if (req.user._id.toString() !== userId && req.user.role !== "admin") {
    return res.status(403).json({ 
      error: "No tienes permiso para acceder a este recurso" 
    });
  }

  next();
};