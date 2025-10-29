require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  try {
    const query = `
      SELECT ul.id, u.nombre as usuario, l.title as lab_title, ul.evidence, ul.submitted_at
      FROM user_labs ul
      JOIN users u ON ul.user_id = u.id
      JOIN labs l ON ul.lab_id = l.id
      WHERE ul.status = 'pendiente'
      ORDER BY ul.submitted_at ASC
    `;

    const result = await pool.query(query);

    res.status(200).json({ writeups: result.rows });
  } catch (error) {
    res.status(500).json({ error: "Error consultando writeups pendientes", detail: error.message });
  }
};
