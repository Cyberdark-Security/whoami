require('dotenv').config();

const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const { user_id, lab_id, evidence } = req.body;

  // Validar datos
  if (!user_id || !lab_id || !evidence) {
    res.status(400).json({ error: "Faltan datos requeridos" });
    return;
  }

  if (!evidence.trim()) {
    res.status(400).json({ error: "La URL no puede estar vacía" });
    return;
  }

  // Validar que sea URL válida
  if (!evidence.match(/^https?:\/\/.+/)) {
    res.status(400).json({ error: "URL inválida" });
    return;
  }

  try {
    // Verificar si el usuario existe
    const userCheck = await pool.query(
      `SELECT id FROM users WHERE id = $1`,
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si el lab existe
    const labCheck = await pool.query(
      `SELECT id FROM labs WHERE id = $1`,
      [lab_id]
    );

    if (labCheck.rows.length === 0) {
      return res.status(404).json({ error: "Laboratorio no encontrado" });
    }

    // Verificar si ya existe un registro para este usuario + lab
    const existCheck = await pool.query(
      `SELECT id FROM user_labs WHERE user_id = $1 AND lab_id = $2`,
      [user_id, lab_id]
    );

    if (existCheck.rows.length > 0) {
      // Actualizar si ya existe
      await pool.query(
        `UPDATE user_labs 
         SET evidence = $1, submitted_at = NOW(), status = 'pendiente'
         WHERE user_id = $2 AND lab_id = $3`,
        [evidence, user_id, lab_id]
      );
    } else {
      // Crear nuevo registro
      await pool.query(
        `INSERT INTO user_labs (user_id, lab_id, evidence, status, submitted_at)
         VALUES ($1, $2, $3, 'pendiente', NOW())`,
        [user_id, lab_id, evidence]
      );
    }

    res.status(200).json({
      message: "✅ Writeup enviado correctamente",
      success: true,
      user_id,
      lab_id
    });
  } catch (error) {
    console.error("Error en submit-writeup:", error);
    res.status(500).json({ 
      error: "Error procesando el writeup",
      detail: error.message 
    });
  }
};
