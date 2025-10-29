require('dotenv').config();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const JWT_SECRET = process.env.JWT_SECRET || 'IGdaSkxMk5wU4D9QTDYzk8PLkU05junR2V6kVhBYcIY=';

// EndPoint: POST /api/admin/login
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT id, nombre, apellido, email, password_hash, role FROM users WHERE email=$1', 
      [email]
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      return;
    }

    const user = result.rows[0];
    if (user.role !== 'admin') {
      res.status(403).json({ error: "Acceso denegado" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      return;
    }

    // Genera el token firmando id y role
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({ 
      token, 
      user: { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor", detail: err.message });
  }
};
