require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { title, published_date, download_link, difficulty } = req.body;

    // Validar datos
    if (!title || !published_date || !download_link || !difficulty) {
      return res.status(400).json({ 
        error: "Todos los campos son requeridos" 
      });
    }

    // Validar dificultad
    const validDifficulties = ['fácil', 'medio', 'difícil', 'insano'];
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return res.status(400).json({ 
        error: "Dificultad inválida. Valores válidos: fácil, medio, difícil, insano" 
      });
    }

    // Insertar en BD
    const query = `
      INSERT INTO labs (title, published_date, download_link, difficulty, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, title, difficulty;
    `;

    const result = await pool.query(query, [
      title,
      published_date,
      download_link,
      difficulty.toLowerCase()
    ]);

    console.log(`✅ [API] Lab creado: ${result.rows[0].title} (${result.rows[0].difficulty})`);

    return res.status(201).json({
      success: true,
      message: "Laboratorio agregado exitosamente",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("❌ [API] Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Error creando laboratorio",
      detail: error.message
    });
  }
};
