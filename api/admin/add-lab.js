require('dotenv').config();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🔐 VERIFICACIÓN DE JWT
const verifyAdminToken = (token) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado');
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    
    if (payload.role !== 'admin') {
      return null;
    }
    
    return payload;
  } catch (err) {
    console.error('❌ JWT Error:', err.message);
    return null;
  }
};

// ✅ Validar URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // 🔐 PASO 1: VERIFICAR TOKEN
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.warn('⚠️ Intento sin token');
      return res.status(401).json({ 
        error: "Token requerido",
        code: "NO_TOKEN"
      });
    }

    // Verificar formato "Bearer token"
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: "Formato inválido: use Bearer token",
        code: "INVALID_FORMAT"
      });
    }

    const token = authHeader.slice(7);
    const user = verifyAdminToken(token);

    if (!user) {
      console.warn('⚠️ Token inválido o usuario no es admin');
      return res.status(403).json({ 
        error: "Acceso denegado: requiere rol admin",
        code: "INSUFFICIENT_PERMISSIONS"
      });
    }

    console.log(`✅ Admin verificado: ${user.email}`);

    // 🔐 PASO 2: VALIDAR DATOS DE ENTRADA
    const { title, difficulty, megalink } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ 
        error: "El título es requerido" 
      });
    }

    if (!difficulty) {
      return res.status(400).json({ 
        error: "La dificultad es requerida" 
      });
    }

    if (!megalink || !megalink.trim()) {
      return res.status(400).json({ 
        error: "El megalink es requerido" 
      });
    }

    // Validar dificultad
    const validDifficulties = ['Fácil', 'Medio', 'Difícil'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ 
        error: "Dificultad inválida. Valores válidos: Fácil, Medio, Difícil" 
      });
    }

    // Validar URL
    if (!isValidUrl(megalink)) {
      return res.status(400).json({ 
        error: "El megalink debe ser una URL válida (https://...)" 
      });
    }

    // ✅ SANITIZAR INPUTS
    const sanitizedTitle = title.trim().slice(0, 255);
    const sanitizedMegalink = megalink.trim().slice(0, 500);

    // 🔐 PASO 3: INSERTAR EN BD (Con auditoría)
    const query = `
      INSERT INTO labs (title, difficulty, megalink, created_by, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id, title, difficulty, megalink, created_at
    `;

    const result = await pool.query(query, [
      sanitizedTitle,
      difficulty,
      sanitizedMegalink,
      user.id  // 🔐 AUDITORÍA: Guardar quién creó
    ]);

    console.log(`✅ Lab creado por ${user.email}: "${result.rows[0].title}" (ID: ${result.rows[0].id})`);

    return res.status(201).json({
      success: true,
      message: "Laboratorio agregado exitosamente",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    
    // Manejo de errores específicos
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "Este laboratorio ya existe"
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        error: "Usuario inválido"
      });
    }

    // Error genérico (sin detalles por seguridad)
    return res.status(500).json({
      success: false,
      error: "Error creando laboratorio"
    });
  }
};
