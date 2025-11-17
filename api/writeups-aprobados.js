require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });

  try {
    const result = await pool.query(
      `SELECT w.id, w.lab_id, w.user_id, w.enlace, w.fecha,
              u.nombre as usuario, l.title as maquina
       FROM writeups w
       JOIN users u ON w.user_id = u.id
       JOIN labs l ON w.lab_id = l.id
       WHERE w.estado = 'aprobado'
       ORDER BY w.fecha DESC`
    );

    res.status(200).json({ success: true, writeups: result.rows });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
};
