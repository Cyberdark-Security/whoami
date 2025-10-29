const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const result = await pool.query(
      "SELECT id, nombre, apellido, email, password_hash FROM users WHERE email=$1",
      [email]
    );
    if (result.rows.length === 0)
      return res.status(400).json({ error: "Usuario no encontrado" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

    return res.status(200).json({
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Error del servidor" });
  }
};
