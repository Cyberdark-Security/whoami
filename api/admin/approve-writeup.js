const { Pool } = require('pg');
const verifyAdmin = require('../../utils/verifyAdmin');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = (req, res) => {
  verifyAdmin(req, res, async () => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: "Método no permitido" });
      return;
    }
    const { user_lab_id, approve } = req.body;
    if (!user_lab_id || typeof approve !== 'boolean') {
      res.status(400).json({ error: "Parámetros inválidos" });
      return;
    }
    try {
      const newStatus = approve ? 'aprobado' : 'rechazado';
      const result = await pool.query(
        `UPDATE user_labs SET status=$1, verified_at=NOW(), verified_by=$2 WHERE id=$3 RETURNING *`,
        [newStatus, req.user.id, user_lab_id]
      );
      res.status(200).json({ message: `Writeup ${newStatus}`, data: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: "Error del servidor", detail: err.message });
    }
  });
};
