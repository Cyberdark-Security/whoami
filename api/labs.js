const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }
  try {
    const result = await pool.query(`
      SELECT id, title, description, created_at
      FROM labs
      ORDER BY created_at DESC
    `);
    res.status(200).json({ labs: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Error consultando laboratorios" });
  }
};
