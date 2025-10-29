const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: "Método no permitido", flag: "method_error" });
    return;
  }

  const { nombre, apellido, email, password } = req.body;
  
  if (!nombre || !apellido || !email || !password) {
    res.status(400).json({ error: "Todos los campos son obligatorios", flag: "missing_fields" });
    return;
  }

  // VALIDACIÓN de contraseña: mínimo 6 y no solo espacios
  if (password.trim().length < 6) {
    res.status(400).json({ error: "La contraseña debe tener mínimo 6 caracteres y no solo espacios.", flag: "invalid_password" });
    return;
  }

  try {
    // Prueba conexión
    try {
      await pool.query('SELECT 1');
    } catch (connErr) {
      res.status(500).json({ error: "No se pudo conectar con la base de datos", flag: "connection_error", detail: connErr.message });
      return;
    }

    // Ver si el correo ya existe
    let exists;
    try {
      exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    } catch (existsErr) {
      res.status(500).json({ error: "Error buscando correo", flag: "search_email_error", detail: existsErr.message });
      return;
    }
    if (exists.rows.length > 0) {
      res.status(400).json({ error: "El correo ya está registrado", flag: "email_exists" });
      return;
    }

    // Hash
    let hash;
    try {
      hash = await bcrypt.hash(password, 10);
    } catch (hashErr) {
      res.status(500).json({ error: "Error haciendo hash", flag: "bcrypt_error", detail: hashErr.message });
      return;
    }

    // Insertar usuario
    let result;
    try {
      result = await pool.query(
       'INSERT INTO users (nombre, apellido, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre, apellido, email, role',
        [nombre, apellido, email, hash, 'user']
      );
    } catch (insertErr) {
      res.status(500).json({ error: "Error insertando usuario", flag: "insert_error", detail: insertErr.message });
      return;
    }


    res.status(201).json({ user: result.rows[0], flag: "registro_ok" });

  } catch (err) {
    res.status(500).json({ error: "Error del servidor", flag: "generic_error", detail: err.message });
  }
};
