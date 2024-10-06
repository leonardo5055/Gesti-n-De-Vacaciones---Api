const db = require('../config/db');

// Obtener todos los empleados
exports.getAllEmpleados = (req, res) => {
    const query = 'SELECT * FROM Empleados';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Crear un empleado
exports.createEmpleado = (req, res) => {
    const { nombres, apellidos, fecha_contratacion, celular, avatar, cargo, dias_vacaciones_acumulados } = req.body;
    const query = 'INSERT INTO Empleados (nombres, apellidos, fecha_contratacion, celular, avatar, cargo, dias_vacaciones_acumulados) VALUES (?, ?, ?, ?, ?, ?, ?)';

    db.query(query, [nombres, apellidos, fecha_contratacion, celular, avatar, cargo, dias_vacaciones_acumulados], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Empleado creado', empleadoId: results.insertId });
    });
};
