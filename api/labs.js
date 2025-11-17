require('dotenv').config();
const { Pool } = require("pg");

// ✅ CORRECTO: Usar DATABASE_URL en lugar de variables individuales
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  // ✅ Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // ✅ GET: Traer todos los labs
    if (req.method === 'GET') {
      const result = await pool.query('SELECT * FROM labs ORDER BY created_at DESC');
      return res.status(200).json({ labs: result.rows });
    }

    // ✅ POST: Crear nuevo lab
    if (req.method === 'POST') {
      let { title, difficulty, megalink } = req.body;

      // Normalizar datos
      title = title?.trim();
      megalink = megalink?.trim();
      difficulty = difficulty?.toLowerCase()?.trim();

      // Validación título
      if (!title || title.length === 0) {
        return res.status(400).json({ error: "El título es requerido" });
      }

      // Validación megalink
      if (!megalink || megalink.length === 0) {
        return res.status(400).json({ error: "El megalink es requerido" });
      }

      // Validar que sea URL válida
      try {
        new URL(megalink);
      } catch (err) {
        return res.status(400).json({ error: "El megalink debe ser una URL válida" });
      }

      // Map de dificultad: acepta minúsculas, convierte a formato DB
      const mapDifficulty = {
        "fácil": "Fácil",
        "facil": "Fácil",
        "medio": "Medio",
        "difícil": "Difícil",
        "dificil": "Difícil",
        "insano": "Insano"
      };

      const mappedDifficulty = mapDifficulty[difficulty];
      
      if (!mappedDifficulty) {
        return res.status(400).json({ 
          error: "Dificultad debe ser: Fácil, Medio, Difícil o Insano",
          received: difficulty
        });
      }

      // Insertar en BD
      try {
        const query = `
          INSERT INTO labs (title, difficulty, megalink, created_at)
          VALUES ($1, $2, $3, NOW())
          RETURNING *
        `;
        const values = [title, mappedDifficulty, megalink];
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
    return res.status(500).json({ error: "Error en el servidor", details: err.message });
  }
};
