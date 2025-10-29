require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password) {
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  try {
    const existe = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (existe.rows.length > 0) {
      res.status(409).json({ error: "El correo ya está registrado." });
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (nombre, apellido, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, apellido, email, role`,
      [nombre, apellido, email, hash, 'user']
    );

    // Asegúrate de esta línea: ¡debe usar result.rows[0]!
    return res.status(200).json({ user: result.rows[0] });

  } catch (err) {
    // Muestra error sólo si realmente ocurrió un fallo, y como JSON
    res.status(500).json({ error: "Error en el servidor", details: err.message });
  }
};
