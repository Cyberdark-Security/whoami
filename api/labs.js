require('dotenv').config();

const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method === "GET") {
    // ...listado como ya tienes
  } else if (req.method === "POST") {
    // Validar que solo admin pueda crear (agrega tu check de admin según tu auth)
    const { title, created_at, megaLink } = req.body;
    if (!title || !created_at || !megaLink) {
      res.status(400).json({ error: "Faltan campos" });
      return;
    }
    try {
      await pool.query(
        `INSERT INTO labs (title, created_at, megaLink) VALUES ($1, $2, $3)`,
        [title, created_at, megaLink]
      );
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Error agregando laboratorio" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
};
