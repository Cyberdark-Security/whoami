const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

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
      'SELECT id, nombre, apellido, email, password_hash FROM users WHERE email=$1',
      [email]
    );

    // NUNCA reveles si el usuario existe o no, solo verifica
    if (result.rows.length === 0) {
      // Simula el tiempo de hash para evitar ataques de tiempo
      await bcrypt.hash(password, 10);
      res.status(401).json({ error: "Usuario y/o contraseña incorrectos" });
      return;
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ error: "Usuario y/o contraseña incorrectos" });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
};
