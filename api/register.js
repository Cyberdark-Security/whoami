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
    res.status(400).json({ error: "Todos los campos son obligatorios" });
    return;
  }

  try {
    const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length > 0) {
      res.status(400).json({ error: "El correo ya está registrado" });
      return;
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (nombre, apellido, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, email',
      [nombre, apellido, email, hash]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor", detail: err.message });
  }
};
