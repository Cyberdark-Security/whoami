require('dotenv').config();
const { Pool } = require("pg");
const jwt = require('jsonwebtoken');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const JWT_SECRET = process.env.JWT_SECRET || 'IGdaSkxMk5wU4D9QTDYzk8PLkU05junR2V6kVhBYcIY=';

function verificarToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.role === 'admin' ? decoded : null;
  } catch {
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const user = verificarToken(req);
  if (!user) return res.status(401).json({ error: "No autorizado" });

  const { writeupId, aprobar } = req.body;
  if (!writeupId) return res.status(400).json({ error: "writeupId requerido" });

  try {
    const newStatus = aprobar ? 'aprobado' : 'rechazado';

    await pool.query(`UPDATE writeups SET estado = $1 WHERE id = $2`, [newStatus, writeupId]);

    if (aprobar) {
      await pool.query(
        `UPDATE users SET puntos = puntos + 1 WHERE id = (SELECT user_id FROM writeups WHERE id = $1)`,
        [writeupId]
      );
    }

    res.status(200).json({ success: true, message: `Writeup ${newStatus}` });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
};
