require('dotenv').config();

const { Pool } = require("pg");
const jwt = require('jsonwebtoken');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.JWT_SECRET || 'IGdaSkxMk5wU4D9QTDYzk8PLkU05junR2V6kVhBYcIY=';

// Verificar JWT Token
function verificarToken(req) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: true, code: 401, message: 'Token requerido' };
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return { error: true, code: 403, message: 'No eres admin' };
    }
    
    return { error: false, user: decoded };
  } catch (err) {
    return { error: true, code: 401, message: 'Token inválido' };
  }
}

module.exports = async (req, res) => {
  try {
    // ✅ GET / - WRITEUPS PÚBLICOS (Sin token)
    if (req.method === "GET" && req.url === "/api/writeups") {
      const result = await pool.query(
        `SELECT 
          ul.id,
          ul.lab_id,
          ul.user_id,
          ul.submitted_at,
          u.nombre,
          u.apellido,
          l.title as lab_title,
          ul.evidence
        FROM user_labs ul
        JOIN users u ON ul.user_id = u.id
        JOIN labs l ON ul.lab_id = l.id
        WHERE ul.status = 'aprobado'
        ORDER BY ul.submitted_at DESC`
      );

      console.log('✅ Writeups públicos encontrados:', result.rows.length);
      return res.status(200).json(result.rows);
    }

    // ✅ GET /pending - WRITEUPS PENDIENTES (Requiere token de admin)
    if (req.method === "GET" && req.url === "/api/writeups/pending") {
      const tokenCheck = verificarToken(req);
      if (tokenCheck.error) {
        return res.status(tokenCheck.code).json({ error: tokenCheck.message });
      }

      const result = await pool.query(
        `SELECT 
          w.id,
          w.lab_id,
          w.user_id,
          w.evidence,
          w.submitted_at,
          w.status,
          u.nombre,
          u.apellido,
          u.email,
          l.title as lab_title
         FROM writeups w
         JOIN users u ON w.user_id = u.id
         JOIN labs l ON w.lab_id = l.id
         WHERE w.status = 'pendiente'
         ORDER BY w.submitted_at DESC`
      );

      console.log('✅ Writeups pendientes encontrados:', result.rows.length);
      return res.status(200).json({ 
        success: true,
        data: result.rows 
      });
    }

    // ✅ POST /approve - APROBAR/RECHAZAR (Requiere token de admin)
    if (req.method === "POST" && req.url === "/api/writeups/approve") {
      const tokenCheck = verificarToken(req);
      if (tokenCheck.error) {
        return res.status(tokenCheck.code).json({ error: tokenCheck.message });
      }

      const { writeupId, aprobar } = req.body;

      if (!writeupId) {
        return res.status(400).json({ error: "writeupId requerido" });
      }

      const newStatus = aprobar ? 'aprobado' : 'rechazado';

      // Actualizar writeup
      await pool.query(
        `UPDATE writeups SET estado = $1 WHERE id = $2`,
        [newStatus, writeupId]
      );

      // Si es aprobado, sumar puntos al usuario
      if (aprobar) {
        await pool.query(
          `UPDATE users SET puntos = puntos + 1 
           WHERE id = (SELECT user_id FROM writeups WHERE id = $1)`,
          [writeupId]
        );
      }

      console.log(`✅ Writeup ${writeupId} ${newStatus}`);
      return res.status(200).json({ 
        success: true,
        message: `Writeup ${newStatus} exitosamente`
      });
    }

    return res.status(405).json({ error: "Método no permitido" });

  } catch (err) {
    console.error('❌ Error en writeups:', err);
    return res.status(500).json({ 
      error: 'Error del servidor',
      detail: err.message 
    });
  }
};
