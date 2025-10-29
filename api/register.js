require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

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
    // Verifica si ya existe ese correo
    const existe = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existe.rows.length > 0) {
      res.status(409).json({ error: "El correo ya está registrado." });
      return;
    }

    // Hashea la contraseña
    const hash = await bcrypt.hash(password, 10);

    // Inserta usuario (rol por defecto: 'user')
    const result = await pool.query(
      `INSERT INTO users (nombre, apellido, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, apellido, email, role`,
      [nombre, apellido, email, hash, 'user']
    );

    // Devuelve el usuario como espera el frontend
    return res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor", details: err.message });
  }
};
