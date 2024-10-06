const db = require('../config/db');

// Iniciar sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM vacaciones.Usuarios WHERE email = ?';

    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err); // Muestra el error en la consola
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const usuario = results[0];

        // Verificar la contraseña
        const veriContra = password === usuario.password;

        if (!veriContra) {
            return res.status(401).json({ message: 'contraseña incorrectas' });
        }

        // Devolver datos del usuario (sin el password)
        const { usuario_id, empleado_id, rol } = usuario;

        res.json({
            message: 'Inicio de sesión exitoso',
            usuario: {
                usuario_id,
                empleado_id,
                rol
            }
        });
        console.log("POST de usuarios")
    });
};
