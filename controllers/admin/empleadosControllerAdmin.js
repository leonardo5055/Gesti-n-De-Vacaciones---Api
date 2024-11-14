//controllers/empleadosController.js
const db = require('../../config/db');

// Actualizar un empleado
exports.updateEmpleado = (req, res) => {
    console.log("Entro para editar el empleado")
    const { empleado_id } = req.params;
    const { email, rol, cargo_id } = req.body;

    const updates = [];
    const params = [];

    // Verificar si hay datos para actualizar en la tabla Usuarios
    if (email) {
        updates.push('u.email = ?');
        params.push(email);
    }
    if (rol) {
        updates.push('u.rol = ?');
        params.push(rol);
    }

    // Actualizar el cargo del empleado en la tabla Empleados
    if (cargo_id) {
        updates.push('e.cargo_id = ?');
        params.push(cargo_id);
    }

    // Construir consulta dinámica
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No hay cambios para actualizar' });
    }

    const query = `
        UPDATE Usuarios u
        JOIN Empleados e ON u.empleado_id = e.empleado_id
        SET ${updates.join(', ')}
        WHERE e.empleado_id = ?
    `;
    params.push(empleado_id);

    db.query(query, params, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error al actualizar el empleado', details: error });
        }
        res.status(200).json({ message: 'Empleado actualizado correctamente' });
    });
};


