const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_estoooo_super_seguro';

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No autorizado: token requerido" });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: "No autorizado: acceso prohibido" });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = verifyAdmin;
