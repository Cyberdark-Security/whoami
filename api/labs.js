require('dotenv').config();
const { Pool } = require("pg");

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
  if (req.method === "GET") {
    try {
      // ✅ CORREGIDO: usar megalink (no download_link)
      const result = await pool.query(
        `SELECT id, title, created_at, megalink, difficulty 
         FROM labs 
         ORDER BY created_at DESC`
      );
      res.status(200).json({ labs: result.rows });
    } catch (err) {
      console.error("Error consultando laboratorios:", err);
      res.status(500).json({ error: "Error consultando laboratorios" });
    }
  } 
  else if (req.method === "POST") {
    // ✅ SEGURIDAD: NO aceptar created_at del cliente
    const { title, difficulty, megalink } = req.body;

    // ✅ VALIDAR TODOS LOS CAMPOS
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "El título es requerido" });
    }

    if (!difficulty) {
      return res.status(400).json({ error: "La dificultad es requerida" });
    }

    const validDifficulties = ["Fácil", "Medio", "Difícil"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ 
        error: "Dificultad debe ser: Fácil, Medio o Difícil" 
      });
    }

    if (!megalink || !megalink.trim()) {
      return res.status(400).json({ error: "El megalink es requerido" });
    }

    // ✅ VALIDAR que sea una URL válida
    if (!isValidUrl(megalink)) {
      return res.status(400).json({ error: "El megalink debe ser una URL válida" });
    }

    // ✅ SANITIZAR input
    const sanitizedTitle = title.trim().slice(0, 255); // Limitar longitud
    const sanitizedMegalink = megalink.trim().slice(0, 500);

    try {
      // ✅ SEGURIDAD: created_at se genera automático en el servidor
      const result = await pool.query(
        `INSERT INTO labs (title, difficulty, megalink, created_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         RETURNING id, title, difficulty, megalink, created_at`,
        [sanitizedTitle, difficulty, sanitizedMegalink]
      );

      res.status(201).json({ 
        success: true,
        message: "✅ Laboratorio creado exitosamente",
        lab: result.rows[0]
      });

    } catch (err) {
      console.error("Error al agregar laboratorio:", err);
      
      // ❌ SEGURIDAD: No exponer detalles del error
      if (err.code === "23505") { // Duplicate key
        return res.status(409).json({ error: "Este laboratorio ya existe" });
      }
      
      res.status(500).json({ error: "Error creando el laboratorio" });
    }
  } 
  else {
    res.status(405).json({ error: "Método no permitido" });
  }
};
