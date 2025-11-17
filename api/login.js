require('dotenv').config();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ✅ CONFIGURAR RATE LIMITING
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                     // Máximo 5 intentos
  message: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Generar clave por IP + email para más precisión
    return `${req.ip}:${req.body?.email || 'unknown'}`;
  }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  // ✅ APLICAR RATE LIMITING
  await new Promise((resolve, reject) => {
    loginLimiter(req, res, (err) => {
      if (err) {
        res.status(429).json({ error: "Demasiados intentos. Intenta más tarde." });
        reject(err);
      } else {
        resolve();
      }
    });
  }).catch(() => {
    return;
  });

  const { email, password } = req.body;
  
  // ✅ VALIDACIONES
  if (!email || !password) {
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  if (email.trim() === '' || password.trim() === '') {
    res.status(400).json({ error: "Email y contraseña no pueden estar vacíos" });
    return;
  }

  try {
    // ✅ BUSCAR USUARIO (sin loguear contraseña)
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, password_hash, role FROM users WHERE email=$1',
      [email]
    );

    if (result.rows.length === 0) {
      // ✅ SEGURIDAD: Dummy hash (para no revelar si el email existe)
      await bcrypt.hash(password, 10);
      console.log(`❌ Intento de login fallido: usuario no encontrado`); // SIN email
      res.status(401).json({ error: "Usuario y/o contraseña incorrectos" });
      return;
    }

    const user = result.rows[0];

    // ✅ VERIFICAR CONTRASEÑA CON BCRYPT
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      console.log(`❌ Intento de login fallido para: ${email}`); // SIN password
      res.status(401).json({ error: "Usuario y/o contraseña incorrectos" });
      return;
    }

    // ✅ LOGIN EXITOSO - NUNCA enviar password
    console.log(`✅ Login exitoso para: ${email}`);
    
    res.status(200).json({
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.role
        // ⚠️ NUNCA incluir password_hash
      },
      flag: "login_ok"
    });

  } catch (err) {
    console.error('❌ Error en login:', err.message); // SIN stack completo
    res.status(500).json({ error: "Error del servidor" });
  }
};
