require('dotenv').config();

const { Pool } = require("pg");
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const result = await pool.query(
        `SELECT id, title, created_at, download_link, difficulty FROM labs ORDER BY created_at DESC`
      );
      res.status(200).json({ labs: result.rows });
    } catch (err) {
      console.error("Error consultando laboratorios:", err);
      res.status(500).json({ error: "Error consultando laboratorios" });
    }
  } else if (req.method === "POST") {
    const { title, created_at, download_link } = req.body;
    if (!title || !created_at || !download_link) {
      res.status(400).json({ error: "Faltan campos" });
      return;
    }
    try {
      await pool.query(
        `INSERT INTO labs (title, created_at, download_link) VALUES ($1, $2, $3)`,
        [title, created_at, download_link]
      );
      res.status(201).json({ success: true });
    } catch (err) {
      console.error("Error al agregar laboratorio:", err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
};
