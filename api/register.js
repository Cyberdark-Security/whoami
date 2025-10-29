// /api/register.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { nombre, apellido, email, password } = req.body;

  if (!nombre || !apellido || !email || !password)
    return res.status(400).json({ error: "Todos los campos son obligatorios" });

  const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
  if (exists.rows.length > 0)
    return res.status(400).json({ error: "El correo ya está registrado" });

  const hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (nombre, apellido, email, password_hash)
       VALUES ($1, $2, $3, $4) RETURNING id, nombre, apellido, email`,
    [nombre, apellido, email, hash]
  );

  res.status(201).json({ user: result.rows[0] });
};
