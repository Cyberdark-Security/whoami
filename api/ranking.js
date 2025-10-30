const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  const result = await pool.query(
    `SELECT id, nombre, puntos FROM users ORDER BY puntos DESC, id ASC LIMIT 30`
  );
  res.json({ ranking: result.rows });
};
