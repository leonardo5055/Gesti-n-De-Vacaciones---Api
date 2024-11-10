const db = require('../config/db');

// Obtener todas las solicitudes de vacaciones
exports.getAllVacaciones = (req, res) => {
    const query = `SELECT 
    v.vacacion_id, 
    v.empleado_id, 
    v.motivo_id, 
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
