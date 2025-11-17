require('dotenv').config();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return `${req.ip}:${req.body?.email || 'unknown'}`;
  },
  skip: (req, res) => {
    return req.method !== 'POST';
  }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  await new Promise((resolve, reject) => {
    loginLimiter(req, res, (err) => {
      if (err) {
        res.status(429).json({ error: "Demasiados intentos. Intenta más tarde." });
        reject(err);
      } else {
        resolve();
      }
    });
  }).catch((err) => {
    return;
  });

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  if (email.trim() === '' || password.trim() === '') {
    res.status(400).json({ error: "Email y contraseña no pueden estar vacíos" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Formato de email inválido" });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, password_hash, role FROM users WHERE email=$1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      await bcrypt.hash(password, 10);
      res.status(401).json({ error: "Usuario y/o contraseña incorrectos" });
      return;
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ error: "Usuario y/o contraseña incorrectos" });
      return;
    }

    // 🔑 GENERAR JWT TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura_cambiar_en_produccion',
      { expiresIn: '24h' }
    );

    // Configurar headers de seguridad
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader(
      'Content-Security-Policy',
      "frame-ancestors 'self'"
    );
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );

    // ✅ RESPONDER CON TOKEN
    res.status(200).json({
      token,  // ✅ NUEVO
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role
      },
      flag: "login_ok",
      message: "Login exitoso"
    });

  } catch (err) {
    console.error('❌ Error en login:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({
      error: "Error del servidor. Por favor intenta de nuevo más tarde."
    });
  }
};
