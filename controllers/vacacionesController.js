const db = require('../config/db');

// Obtener todas las solicitudes de vacaciones
exports.getAllVacaciones = (req, res) => {
    const query = `SELECT 
    v.vacacion_id, 
    v.empleado_id, 
    e.nombres AS nombre_empleado, 
    e.apellidos AS apellido_empleado,
    e.avatar, -- Campo avatar del empleado
    c.cargo, -- Campo cargo desde la tabla Cargos
    v.motivo_id, 
    m.motivo AS motivo_vacaciones, -- Campo motivo desde la tabla Motivos
    v.descripcion, 
    DATE_FORMAT(v.fecha_inicio, '%d/%m/%Y') AS fecha_inicio, 
    DATE_FORMAT(v.fecha_fin, '%d/%m/%Y') AS fecha_fin, 
    v.dias_solicitados, 
    v.estado, 
    DATE_FORMAT(v.fecha_solicitud, '%d/%m/%Y') AS fecha_solicitud, 
    -- Si el estado es 'Rechazado', obtenemos el motivo_rechazo_id y descripcion de la tabla MotivosRechazo
    CASE 
        WHEN v.estado = 'Rechazado' THEN mr.motivo_rechazo_id 
        ELSE NULL 
    END AS motivo_rechazo_id,
    CASE 
        WHEN v.estado = 'Rechazado' THEN mr.descripcion 
        ELSE NULL 
    END AS descripcion_rechazo
FROM vacaciones.Vacaciones v
-- JOIN con la tabla Empleados para obtener datos del empleado
LEFT JOIN vacaciones.Empleados e ON v.empleado_id = e.empleado_id
-- JOIN con la tabla Cargos para obtener el cargo del empleado
LEFT JOIN vacaciones.Cargos c ON e.cargo_id = c.cargo_id
-- JOIN con la tabla Motivos para obtener el campo motivo
LEFT JOIN vacaciones.Motivos m ON v.motivo_id = m.motivo_id
-- LEFT JOIN con la tabla MotivosRechazo para obtener los motivos de rechazo
LEFT JOIN vacaciones.MotivosRechazo mr ON v.motivo_rechazo_id = mr.motivo_rechazo_id
ORDER BY v.vacacion_id DESC;
`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Crear una solicitud de vacaciones
exports.createVacacion = (req, res) => {
    const { empleado_id, motivo_id, descripcion, fecha_inicio, fecha_fin, dias_solicitados } = req.body;
    const query = 'INSERT INTO vacaciones.Vacaciones (empleado_id, motivo_id, descripcion, fecha_inicio, fecha_fin, dias_solicitados) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [empleado_id, motivo_id, descripcion, fecha_inicio, fecha_fin, dias_solicitados], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Solicitud de vacaciones creada', vacacionId: results.insertId });
    });
};
