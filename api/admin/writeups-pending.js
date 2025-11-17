require('dotenv').config();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');


// Conexión a la BD
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


// 🔐 VERIFICACIÓN DE JWT (Igual que add-lab.js y approve-writeup.js)
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


module.exports = async (req, res) => {
  // Solo permite GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // 🔐 PASO 1: VERIFICAR TOKEN
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.warn('⚠️ Intento de writeups-pending sin token');
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
      console.warn('⚠️ Token inválido o usuario no es admin en writeups-pending');
      return res.status(403).json({ 
        error: "Acceso denegado: requiere rol admin",
        code: "INSUFFICIENT_PERMISSIONS"
      });
    }

    console.log(`✅ Admin verificado en writeups-pending: ${user.email}`);

    // 🔐 PASO 2: CONSULTAR WRITEUPS PENDIENTES
    console.log("🔍 [API] Consultando writeups pendientes...");

    const query = `
      SELECT 
        ul.id,
        ul.user_id,
        ul.lab_id,
        ul.evidence,
        ul.submitted_at,
        ul.status,
        u.nombre,
        u.apellido,
        u.email,
        l.title as lab_title,
        l.difficulty
      FROM user_labs ul
      INNER JOIN users u ON ul.user_id = u.id
      INNER JOIN labs l ON ul.lab_id = l.id
      WHERE LOWER(TRIM(ul.status)) = 'pendiente'
      ORDER BY ul.submitted_at ASC
    `;

    const result = await pool.query(query);

    console.log(`✅ [API] ${result.rows.length} writeups encontrados por admin ${user.email}`);
    console.log("📊 [API] Datos:", JSON.stringify(result.rows, null, 2));

    return res.status(200).json({ 
      success: true,
      total: result.rows.length,
      requested_by: user.email,
      requested_at: new Date().toISOString(),
      writeups: result.rows
    });

  } catch (error) {
    console.error("❌ [API] Error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Error consultando writeups pendientes", 
      detail: process.env.NODE_ENV === 'development' ? error.message : "Error interno del servidor"
    });
  }
};
