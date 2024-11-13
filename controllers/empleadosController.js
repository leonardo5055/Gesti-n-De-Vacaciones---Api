//controllers/empleadosController.js
const db = require('../config/db');

// Obtener todos los empleados
exports.getAllEmpleados = (req, res) => {
    const query = `
        SELECT e.empleado_id, e.nombres, e.apellidos, 
            DATE_FORMAT(e.fecha_nacimiento, '%d-%m-%y') AS fecha_nacimiento,
            DATE_FORMAT(e.fecha_contratacion, '%d-%m-%Y') AS fecha_contratacion,
            e.celular, e.avatar, e.cargo_id, e.dias_vacaciones_acumulados,
            DATE_FORMAT(e.fecha_creacion, '%d-%m-%Y') AS fecha_creacion,
            DATE_FORMAT(e.fecha_actualizacion, '%d-%m-%Y') AS fecha_actualizacion,
            u.email, u.rol
        FROM Empleados e
        LEFT JOIN Usuarios u ON e.empleado_id = u.empleado_id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};


// Crear un empleado y usuario asociado
exports.createEmpleado = (req, res) => {
    console.log("entro a crear usuarios y empleados")
    const { nombres, apellidos, fecha_nacimiento, fecha_contratacion, celular, cargo_id, email, password, rol } = req.body;

    // Validaciones básicas
    if (!nombres || !apellidos || !fecha_nacimiento || !fecha_contratacion || !email || !password || !rol) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    try {
        // Comprobar si el email ya está registrado
        const emailQuery = 'SELECT * FROM vacaciones.Usuarios WHERE email = ?';
        db.query(emailQuery, [email], async (err, emailResult) => {
            if (err) {
                return res.status(500).json({ error: 'Error en la verificación de email', details: err.message });
            }

            if (emailResult.length > 0) {
                // Email ya registrado
                return res.status(400).json({ error: 'El email ya está en uso' });
            }

            // Si el email no existe, proceder con el registro
            // Definir la consulta SQL para insertar el empleado
            const empleadoQuery = `
                INSERT INTO vacaciones.Empleados (nombres, apellidos, fecha_nacimiento, fecha_contratacion, celular, avatar, cargo_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            // Definir valores para el empleado, usando avatar predeterminado
            const empleadoValues = [nombres, apellidos, fecha_nacimiento, fecha_contratacion, celular, "foto-predeterminada.jpg", cargo_id];

            // Ejecutar la consulta para insertar al empleado
            db.query(empleadoQuery, empleadoValues, (err, empleadoResult) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al insertar empleado', details: err.message });
                }

                // Obtener el id del empleado recién creado
                const empleadoId = empleadoResult.insertId;

                // Definir la consulta SQL para insertar el usuario
                const usuarioQuery = `
                    INSERT INTO vacaciones.Usuarios (empleado_id, email, password, rol)
                    VALUES (?, ?, ?, ?)
                `;

                // Definir valores para el usuario
                const usuarioValues = [empleadoId, email, password, rol];

                // Ejecutar la consulta para insertar el usuario
                db.query(usuarioQuery, usuarioValues, (err, usuarioResult) => {
                    if (err) {
                        // Si ocurre un error al crear el usuario, se podría eliminar el empleado creado
                        db.query('DELETE FROM vacaciones.Empleados WHERE empleado_id = ?', [empleadoId]);
                        return res.status(500).json({ error: 'Error al insertar usuario', details: err.message });
                    }

                    // Responder con éxito y detalles de los IDs creados
                    res.json({
                        message: 'Empleado y usuario creados exitosamente',
                        empleadoId: empleadoId,
                        usuarioId: usuarioResult.insertId
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor', details: error.message });
    }
}

// Obtener un empleado por ID
exports.getEmpleadoById = (req, res) => {
    const empleadoId = req.params.id;  // Obtenemos el ID desde los parámetros de la URL
    const query = 'SELECT * FROM vacaciones.Empleados WHERE empleado_id = ?';  // Consulta SQL para obtener el empleado

    db.query(query, [empleadoId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }

        res.json(results[0]);  // Retornamos el empleado encontrado
    });
};
