require('dotenv').config();

const { Pool } = require('pg');

// Conexión a la BD
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  // Solo permite GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
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
        l.title as lab_title
      FROM user_labs ul
      INNER JOIN users u ON ul.user_id = u.id
      INNER JOIN labs l ON ul.lab_id = l.id
      WHERE LOWER(TRIM(ul.status)) = 'pendiente'
      ORDER BY ul.submitted_at ASC
    `;

    const result = await pool.query(query);

    console.log(`✅ [API] ${result.rows.length} writeups encontrados`);
    console.log("📊 [API] Datos:", JSON.stringify(result.rows, null, 2));

    return res.status(200).json({ 
      success: true,
      total: result.rows.length,
      writeups: result.rows
    });

  } catch (error) {
    console.error("❌ [API] Error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Error consultando writeups pendientes", 
      detail: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
