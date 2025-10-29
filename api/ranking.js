const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  try {
    // Consulta que cuenta la cantidad de labs aprobados por cada usuario
    const query = `
      SELECT u.id as user_id, u.nombre as username, COUNT(ul.lab_id) as puntos
      FROM users u
      LEFT JOIN user_labs ul ON ul.user_id = u.id AND ul.status = 'aprobado'
      GROUP BY u.id, u.nombre
      ORDER BY puntos DESC, u.nombre ASC
    `;

    const result = await pool.query(query);

    res.status(200).json({ ranking: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Error consultando ranking", detail: err.message });
  }
};
