const db = require('../config/db');

// Obtener todos los motivos
exports.getAllMotivos = (req, res) => {
    const query = 'SELECT * FROM Motivos';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

// Crear un nuevo motivo
exports.createMotivo = (req, res) => {
    const { motivo, descripcion } = req.body;
    const query = 'INSERT INTO Motivos (motivo, descripcion) VALUES (?, ?)';

    db.query(query, [motivo, descripcion], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Motivo creado', motivoId: results.insertId });
    });
};
