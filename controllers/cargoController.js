const db = require('../config/db');

// Obtener todas las solicitudes de vacaciones
exports.getAllCargos = (req, res) => {
    const query = `SELECT * FROM vacaciones.Cargos;`;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Crear una solicitud de vacaciones
exports.createCargo = (req, res) => {
    const { empleado_id, motivo_id, descripcion, fecha_inicio, fecha_fin, dias_solicitados } = req.body;
    const query = 'INSERT INTO vacaciones.Vacaciones (empleado_id, motivo_id, descripcion, fecha_inicio, fecha_fin, dias_solicitados) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(query, [empleado_id, motivo_id, descripcion, fecha_inicio, fecha_fin, dias_solicitados], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Solicitud de vacaciones creada', vacacionId: results.insertId });
    });
};
