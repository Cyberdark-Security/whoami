require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { user_lab_id, status } = req.body;

    console.log(`📝 [API] Procesando writeup: id=${user_lab_id}, status=${status}`);

    if (!user_lab_id || !status) {
      return res.status(400).json({ 
        error: "user_lab_id y status son requeridos" 
      });
    }

    if (!['aprobado', 'rechazado'].includes(status.toLowerCase())) {
      return res.status(400).json({ 
        error: "status debe ser 'aprobado' o 'rechazado'" 
      });
    }

    // ✅ SIN verified_by (o usa el ID del admin real)
    const query = `
      UPDATE user_labs 
      SET status = $1, 
          verified_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [status.toLowerCase(), user_lab_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: "Writeup no encontrado" 
      });
    }

    console.log(`✅ [API] Writeup ${status}:`, result.rows[0].id);

    return res.status(200).json({ 
      success: true,
      message: `Writeup ${status} exitosamente`,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("❌ [API] Error:", error.message);
    return res.status(500).json({ 
      success: false,
      error: "Error procesando writeup",
      detail: error.message
    });
  }
};
