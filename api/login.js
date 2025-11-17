require('dotenv').config();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ✅ CONFIGURAR RATE LIMITING PARA EVITAR ATAQUES DE FUERZA BRUTA
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP:email
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
  // 1️⃣ VERIFICAR MÉTODO HTTP
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  // 2️⃣ APLICAR RATE LIMITING
  await new Promise((resolve, reject) => {
    loginLimiter(req, res, (err) => {
      if (err) {
        res.status(429).json({ 
          error: "Demasiados intentos. Intenta más tarde." 
        });
        reject(err);
      } else {
        resolve();
      }
    });
  }).catch((err) => {
    return;
  });

  // 3️⃣ EXTRAER Y VALIDAR DATOS
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  if (email.trim() === '' || password.trim() === '') {
    res.status(400).json({ 
      error: "Email y contraseña no pueden estar vacíos" 
    });
    return;
  }

  // 4️⃣ VALIDAR FORMATO EMAIL BÁSICO
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ 
      error: "Formato de email inválido" 
    });
    return;
  }

  try {
    // 5️⃣ BUSCAR USUARIO EN BASE DE DATOS
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, password_hash, role FROM users WHERE email=$1',
      [email.toLowerCase()] // Convertir a minúsculas para búsqueda consistente
    );

    // 6️⃣ VALIDAR SI USUARIO EXISTE
    if (result.rows.length === 0) {
      // ⚠️ HACER HASH AUNQUE NO EXISTA (EVITAR TIMING ATTACKS)
      await bcrypt.hash(password, 10);
      res.status(401).json({ 
        error: "Usuario y/o contraseña incorrectos" 
      });
      return;
    }

    const user = result.rows[0];

    // 7️⃣ VALIDAR CONTRASEÑA
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ 
        error: "Usuario y/o contraseña incorrectos" 
      });
      return;
    }

    // 8️⃣ CONFIGURAR HEADERS DE SEGURIDAD
    // Cache-Control: No cachear datos sensibles
    res.setHeader(
      'Cache-Control', 
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );

    // CSP: Evitar clickjacking
    res.setHeader(
      'Content-Security-Policy', 
      "frame-ancestors 'self'"
    );

    // X-Frame-Options: Prevención adicional de clickjacking (legacy)
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');

    // X-Content-Type-Options: Prevenir MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // X-XSS-Protection: Protección contra XSS en navegadores legacy
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Strict-Transport-Security: Forzar HTTPS
    res.setHeader(
      'Strict-Transport-Security', 
      'max-age=31536000; includeSubDomains'
    );

    // 9️⃣ RESPONDER CON DATOS DEL USUARIO (SIN CONTRASEÑA)
    res.status(200).json({
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
    
    // NO revelar detalles del error al cliente (IMPORTANTE)
    res.status(500).json({ 
      error: "Error del servidor. Por favor intenta de nuevo más tarde." 
    });
  }
};
