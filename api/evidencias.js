const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { labId, writeup_url } = req.body;
      // El user_id debería provenir de sesión/JWT. Aquí lo forzamos para pruebas:
      let user_id = req.headers["x-user-id"] || req.body.user_id || 1;

      if (!labId || !writeup_url) {
        return res.status(400).json({ error: "Faltan campos" });
      }

      await pool.query(
        "INSERT INTO writeups (lab_id, user_id, writeup_url, estado) VALUES ($1, $2, $3, 'pendiente')",
        [labId, user_id, writeup_url]
      );
      res.status(201).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
};
