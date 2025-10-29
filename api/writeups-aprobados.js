require('dotenv').config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // o tus datos sueltos
});

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }
  try {
    const resultado = await pool.query(`
      SELECT
        ul.id,
        ul.submitted_at AS fecha,
        l.title AS maquina,
        u.nombre AS usuario,
        ul.evidence AS enlace
      FROM user_labs ul
      JOIN users u ON ul.user_id = u.id
      JOIN labs l ON ul.lab_id = l.id
      WHERE ul.status = 'Aprobado'
      ORDER BY ul.submitted_at DESC
    `);
    res.status(200).json({ writeups: resultado.rows });
  } catch (err) {
    res.status(500).json({ error: "Error consultando writeups" });
  }
};
