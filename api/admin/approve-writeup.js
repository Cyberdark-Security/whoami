require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 🎯 Sistema de puntos personalizado
const POINTS_BY_DIFFICULTY = {
  'fácil': 1,
  'medio': 2,
  'difícil': 5,
  'insano': 8
};

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

    // 1️⃣ Actualizar writeup
    const updateWriteupQuery = `
      UPDATE user_labs 
      SET status = $1, verified_at = NOW()
      WHERE id = $2
      RETURNING user_id, lab_id;
    `;

    const writeupResult = await pool.query(updateWriteupQuery, [status.toLowerCase(), user_lab_id]);
    
    if (writeupResult.rows.length === 0) {
      return res.status(404).json({ 
        error: "Writeup no encontrado" 
      });
    }

    const { user_id, lab_id } = writeupResult.rows[0];

    // 2️⃣ Si está APROBADO, sumar puntos según dificultad
    if (status.toLowerCase() === 'aprobado') {
      // Obtener dificultad de la máquina
      const labQuery = `
        SELECT difficulty FROM labs WHERE id = $1
      `;
      const labResult = await pool.query(labQuery, [lab_id]);
      
      if (labResult.rows.length > 0) {
        const difficulty = (labResult.rows[0].difficulty || 'medio').toLowerCase();
        const points = POINTS_BY_DIFFICULTY[difficulty] || 2;

        // Actualizar puntos del usuario
        const updatePointsQuery = `
          UPDATE users 
          SET puntos = COALESCE(puntos, 0) + $1
          WHERE id = $2;
        `;
        
        await pool.query(updatePointsQuery, [points, user_id]);
        
        console.log(`✅ [API] Usuario ${user_id} ganó ${points} puntos (${difficulty})`);
      }
    }

    return res.status(200).json({ 
      success: true,
      message: `Writeup ${status} exitosamente`
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
