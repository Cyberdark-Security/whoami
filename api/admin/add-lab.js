require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ✅ Validar URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // ✅ CAMBIO: Ahora recibe título, dificultad y megalink (no published_date, no download_link)
    const { title, difficulty, megalink } = req.body;

    // ✅ Validar todos los campos
    if (!title || !title.trim()) {
      return res.status(400).json({ 
        error: "El título es requerido" 
      });
    }

    if (!difficulty) {
      return res.status(400).json({ 
        error: "La dificultad es requerida" 
      });
    }

    if (!megalink || !megalink.trim()) {
      return res.status(400).json({ 
        error: "El megalink es requerido" 
      });
    }

    // ✅ Validar dificultad (ahora con mayúscula)
    const validDifficulties = ['Fácil', 'Medio', 'Difícil']; // ✅ Mayúscula
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ 
        error: "Dificultad inválida. Valores válidos: Fácil, Medio, Difícil" 
      });
    }

    // ✅ Validar que sea URL válida
    if (!isValidUrl(megalink)) {
      return res.status(400).json({ 
        error: "El megalink debe ser una URL válida (https://...)" 
      });
    }

    // ✅ Sanitizar inputs
    const sanitizedTitle = title.trim().slice(0, 255);
    const sanitizedMegalink = megalink.trim().slice(0, 500);

    // ✅ CAMBIO: Insert solo con título, dificultad, megalink, created_at
    const query = `
      INSERT INTO labs (title, difficulty, megalink, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, title, difficulty, megalink, created_at
    `;

    const result = await pool.query(query, [
      sanitizedTitle,
      difficulty,  // ✅ Mantiene mayúscula como llega
      sanitizedMegalink
    ]);

    console.log(`✅ [API] Lab creado: ${result.rows[0].title} (${result.rows[0].difficulty})`);

    return res.status(201).json({
      success: true,
      message: "Laboratorio agregado exitosamente",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("❌ [API] Error:", error.message);
    
    // ✅ SEGURIDAD: No exponer detalles del error
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "Este laboratorio ya existe"
      });
    }

    return res.status(500).json({
      success: false,
      error: "Error creando laboratorio"
      // ❌ NO incluir: detail: error.message (seguridad)
    });
  }
};
