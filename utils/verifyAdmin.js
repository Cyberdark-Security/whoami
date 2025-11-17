// utils/verifyAdmin.js
const jwt = require('jsonwebtoken');

// ⚠️ NUNCA dejar un default - fuerza usar env vars
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET no está configurado en variables de entorno');
  throw new Error('JWT_SECRET is required');
}

function verifyAdmin(req, res, next) {
  try {
    // 1️⃣ Verificar que el header existe
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        error: "No autorizado: token requerido",
        code: "NO_TOKEN"
      });
    }

    // 2️⃣ Verificar formato correcto (Bearer token)
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: "Formato inválido: use Bearer token",
        code: "INVALID_FORMAT"
      });
    }

    // 3️⃣ Extraer token
    const token = authHeader.slice(7); // Remove "Bearer "

    // 4️⃣ Verificar JWT con el SECRET del servidor (NO del cliente)
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'] // Solo aceptar HS256
    });

    // 5️⃣ Verificar que es ADMIN
    if (payload.role !== 'admin') {
      return res.status(403).json({ 
        error: "Acceso prohibido: requiere rol admin",
        code: "INSUFFICIENT_PERMISSIONS"
      });
    }

    // 6️⃣ Verificar que tiene ID
    if (!payload.id || !payload.email) {
      return res.status(401).json({ 
        error: "Token incompleto",
        code: "INVALID_TOKEN_DATA"
      });
    }

    // ✅ Todo bien - pasar al siguiente middleware
    req.user = payload;
    req.user.verified_at = new Date();
    next();

  } catch (err) {
    // 7️⃣ Manejo específico de errores
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Token expirado",
        code: "TOKEN_EXPIRED",
        exp_at: err.expiredAt
      });
    }

    if (err.name === 'JsonWebTokenError') {
      console.warn('⚠️ Token inválido/modificado:', err.message);
      return res.status(401).json({ 
        error: "Token inválido o modificado",
        code: "INVALID_TOKEN"
      });
    }

    // Error desconocido
    console.error('❌ Error en verificación:', err.message);
    return res.status(500).json({ 
      error: "Error en verificación de token",
      code: "SERVER_ERROR"
    });
  }
}

module.exports = verifyAdmin;
