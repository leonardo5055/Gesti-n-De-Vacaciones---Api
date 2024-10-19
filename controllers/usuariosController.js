// controllers/usuariosController.js
const db = require('../config/db');

// Controlador para iniciar sesión
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Consulta para verificar las credenciales y obtener la información del empleado
    const query = `
        SELECT 
    u.usuario_id, 
    u.empleado_id, 
    u.email, 
    u.rol,
    e.nombres, 
    e.apellidos, 
    e.fecha_nacimiento,  -- Si es necesario, ajusta según tus necesidades
    e.fecha_contratacion, 
    e.celular, 
    e.avatar, 
    e.cargo_id,  -- También puedes obtener el cargo_id si es necesario
    e.dias_vacaciones_acumulados
FROM 
    Usuarios u
JOIN 
    Empleados e ON u.empleado_id = e.empleado_id
WHERE 
    u.email = ? 
AND 
    u.password = ?;  -- Aquí deberías usar el hash de la contraseña si lo has almacenado como hash

    `;

    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            // Suponiendo que results[0] es el usuario autenticado
            const usuario = results[0];
            res.json({
                success: true,
                usuario: {
                    usuario_id: usuario.usuario_id,
                    empleado_id: usuario.empleado_id,
                    email: usuario.email,
                    rol: usuario.rol,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    fecha_contratacion: usuario.fecha_contratacion,
                    celular: usuario.celular,
                    avatar: usuario.avatar,
                    cargo: usuario.cargo,
                    dias_vacaciones_acumulados: usuario.dias_vacaciones_acumulados
                },
            });
            console.log("llamado de api validar usuario")
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    });
};
