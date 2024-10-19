// controllers/usuariosController.js
const db = require('../config/db');
const moment = require('moment'); // Asegúrate de instalar moment.js

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
            e.fecha_nacimiento, 
            e.fecha_contratacion, 
            e.celular, 
            e.avatar, 
            e.cargo_id, 
            e.dias_vacaciones_acumulados,
            c.cargo  -- Trae el nombre del cargo
        FROM 
            Usuarios u
        JOIN 
            Empleados e ON u.empleado_id = e.empleado_id
        JOIN 
            Cargos c ON e.cargo_id = c.cargo_id  -- Unir con la tabla Cargos para obtener el nombre del cargo
        WHERE 
            u.email = ? 
        AND 
            u.password = ?;  -- Asegúrate de usar el hash de la contraseña
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
                    fecha_nacimiento: moment(usuario.fecha_nacimiento).format('DD-MM-YYYY'), // Formato deseado
                    fecha_contratacion: moment(usuario.fecha_contratacion).format('DD-MM-YYYY'), // Formato deseado
                    celular: usuario.celular,
                    avatar: usuario.avatar,
                    cargo_id: usuario.cargo_id,
                    cargo: usuario.cargo,
                    dias_vacaciones_acumulados: usuario.dias_vacaciones_acumulados
                },
            });
            console.log("Llamado de API para validar usuario");
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    });
};
