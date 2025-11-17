require('dotenv').config();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


// 🔐 VERIFICACIÓN DE JWT (Igual que add-lab.js)
const verifyAdminToken = (token) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado');
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
    
    if (payload.role !== 'admin') {
      return null;
    }
    
    return payload;
  } catch (err) {
    console.error('❌ JWT Error:', err.message);
    return null;
  }
};


// 🎯 Sistema de puntos personalizado
const POINTS_BY_DIFFICULTY = {
  'fácil': 1,
  'medio': 2,
  'difícil': 5,
  'insano': 8
};


module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }


  try {
    // 🔐 PASO 1: VERIFICAR TOKEN
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.warn('⚠️ Intento de approve-writeup sin token');
      return res.status(401).json({ 
        error: "Token requerido",
        code: "NO_TOKEN"
      });
    }


    // Verificar formato "Bearer token"
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: "Formato inválido: use Bearer token",
        code: "INVALID_FORMAT"
      });
    }


    const token = authHeader.slice(7);
    const user = verifyAdminToken(token);


    if (!user) {
      console.warn('⚠️ Token inválido o usuario no es admin en approve-writeup');
      return res.status(403).json({ 
        error: "Acceso denegado: requiere rol admin",
        code: "INSUFFICIENT_PERMISSIONS"
      });
    }


    console.log(`✅ Admin verificado en approve-writeup: ${user.email}`);


    // 🔐 PASO 2: VALIDAR DATOS DE ENTRADA
    const { user_lab_id, status } = req.body;

    console.log(`📝 [API] Procesando writeup: id=${user_lab_id}, status=${status}`);

    if (!user_lab_id || !status) {
      return res.status(400).json({ 
        error: "user_lab_id y status son requeridos" 
      });
    }

    if (!['aprobado', 'rechazado'].includes(status.toLowerCase())) {
      return res.status(400).json({ 
        error: "status debe ser 'aprobado' o 'rechazado'" 
      });
    }


    // 🔐 PASO 3: ACTUALIZAR WRITEUP
    const updateWriteupQuery = `
      UPDATE user_labs 
      SET status = $1, verified_at = NOW(), verified_by = $2
      WHERE id = $3
      RETURNING user_id, lab_id;
    `;

    const writeupResult = await pool.query(updateWriteupQuery, [status.toLowerCase(), user.id, user_lab_id]);
    
    if (writeupResult.rows.length === 0) {
      return res.status(404).json({ 
        error: "Writeup no encontrado" 
      });
    }

    const { user_id, lab_id } = writeupResult.rows[0];

    console.log(`✅ Writeup ${user_lab_id} actualizado por admin ${user.email}`);


    // 🔐 PASO 4: SI ESTÁ APROBADO, SUMAR PUNTOS SEGÚN DIFICULTAD
    if (status.toLowerCase() === 'aprobado') {
      // Obtener dificultad de la máquina
      const labQuery = `
        SELECT difficulty FROM labs WHERE id = $1
      `;
      const labResult = await pool.query(labQuery, [lab_id]);
      
      if (labResult.rows.length > 0) {
        const difficulty = (labResult.rows[0].difficulty || 'medio').toLowerCase();
        const points = POINTS_BY_DIFFICULTY[difficulty] || 2;

        // Actualizar puntos del usuario
        const updatePointsQuery = `
          UPDATE users 
          SET puntos = COALESCE(puntos, 0) + $1
          WHERE id = $2;
        `;
        
        await pool.query(updatePointsQuery, [points, user_id]);
        
        console.log(`✅ Usuario ${user_id} ganó ${points} puntos (${difficulty}) - Verificado por ${user.email}`);
      }
    } else {
      console.log(`❌ Writeup ${user_lab_id} rechazado por admin ${user.email}`);
    }

    return res.status(200).json({ 
      success: true,
      message: `Writeup ${status} exitosamente`,
      verified_by: user.email,
      verified_at: new Date().toISOString()
    });


  } catch (error) {
    console.error("❌ [API] Error:", error.message);
    
    // Manejo de errores específicos
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        error: "Writeup o usuario inválido"
      });
    }

    // Error genérico (sin detalles por seguridad)
    return res.status(500).json({ 
      success: false,
      error: "Error procesando writeup"
    });
  }
};
