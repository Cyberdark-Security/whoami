require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

module.exports = async (req, res) => {
  try {
    // GET: Traer todos los labs
    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM labs ORDER BY created_at DESC');
      return res.status(200).json({ labs: result.rows });
    }

    // POST: Crear nuevo lab
    if (req.method === 'POST') {
      let { title, difficulty, megalink } = req.body;

      // Normalizar datos
      title = title?.trim();
      megalink = megalink?.trim();
      difficulty = difficulty?.toLowerCase();

      // Validación título
      if (!title) {
        return res.status(400).json({ error: "El título es requerido" });
      }

      // Validación megalink
      if (!megalink) {
        return res.status(400).json({ error: "El megalink es requerido" });
      }

      // Validar que sea URL válida
      try {
        new URL(megalink);
      } catch (err) {
        return res.status(400).json({ error: "El megalink debe ser una URL válida" });
      }

      // Map de dificultad: acepta minúsculas, convierte a formato de DB
      const mapDifficulty = {
        fácil: "Fácil",
        medio: "Medio",
        difícil: "Difícil",
        insano: "Insano"
      };

      if (!mapDifficulty[difficulty]) {
        return res.status(400).json({ 
          error: "Dificultad debe ser: Fácil, Medio, Difícil o Insano" 
        });
      }

      difficulty = mapDifficulty[difficulty];

      // Insertar en BD
      try {
        const query = `
          INSERT INTO labs (title, difficulty, megalink, created_at)
          VALUES ($1, $2, $3, NOW())
          RETURNING *
        `;
        const values = [title, difficulty, megalink];
        const result = await pool.query(query, values);

        return res.status(201).json({
          message: "Laboratorio creado exitosamente",
          lab: result.rows[0]
        });
      } catch (dbError) {
        console.error("Error BD:", dbError.message);
        return res.status(500).json({ 
          error: "Error creando el laboratorio",
          details: dbError.message 
        });
      }
    }

    // Método no permitido
    return res.status(405).json({ error: "Método no permitido" });

  } catch (err) {
    console.error("Error general:", err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
