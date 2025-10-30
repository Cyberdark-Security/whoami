const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const r = await pool.query(
      `SELECT w.*, u.nombre, l.title
       FROM writeups w
       JOIN users u ON w.user_id = u.id
       JOIN labs l ON w.lab_id = l.id
       WHERE w.estado = 'pendiente'
       ORDER BY w.fecha_envio DESC`
    );
    res.status(200).json({ writeups: r.rows });
  } else if (req.method === "POST") {
    const { writeupId, aprobar } = req.body;
    if (!writeupId) return res.status(400).json({ error: "Faltan datos" });

    if (aprobar) {
      await pool.query(`UPDATE writeups SET estado='aprobado' WHERE id=$1`, [writeupId]);
      await pool.query(
        `UPDATE users SET puntos = puntos + 1 WHERE id=(SELECT user_id FROM writeups WHERE id=$1)`,
        [writeupId]
      );
    } else {
      await pool.query(`UPDATE writeups SET estado='rechazado' WHERE id=$1`, [writeupId]);
    }
    res.json({ success: true });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
};
