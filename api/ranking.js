// pages/api/ranking.js
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  try {
    // Selecciona nombre y puntos, excluye admins
    const query = `
      SELECT u.id AS user_id, u.nombre AS username, u.puntos
      FROM users u
      WHERE u.role IS NULL OR u.role != 'admin'
      ORDER BY u.puntos DESC, u.nombre ASC
    `;
    const result = await pool.query(query);
    res.status(200).json({ ranking: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Error consultando ranking", detail: err.message });
  }
};
