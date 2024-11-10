//controllers/admin/vacacionesControllerAdmin.js
const db = require('../../config/db');

// Obtener todas las solicitudes de vacaciones
exports.getAllVacacionesAdmin = (req, res) => {
    // Configurar el formato de fecha a español
    db.query("SET lc_time_names = 'es_ES';", (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Ejecutar la consulta de selección
        const query = `
          SELECT 
    v.vacacion_id,
    e.nombres,
    e.apellidos,
    e.avatar,
    m.motivo,
    v.descripcion,
    v.fecha_inicio,
    MONTHNAME(v.fecha_inicio) AS mes_inicio,
    DAY(v.fecha_inicio) AS dia_inicio,
    DAYNAME(v.fecha_inicio) AS dia_semana_inicio,
    v.fecha_fin,
    MONTHNAME(v.fecha_fin) AS mes_fin,
    DAY(v.fecha_fin) AS dia_fin,
    DAYNAME(v.fecha_fin) AS dia_semana_fin,
    v.dias_solicitados,
    v.estado,
    v.fecha_solicitud
FROM 
    Vacaciones v
JOIN 
    Empleados e ON v.empleado_id = e.empleado_id
JOIN 
    Motivos m ON v.motivo_id = m.motivo_id
WHERE 
    v.estado = 'Pendiente'
ORDER BY 
    v.vacacion_id DESC;


        `;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Formatear las fechas al estilo dd/mm/aaaa
            const formattedResults = results.map((vacacion) => {
                return {
                    ...vacacion,
                    fecha_inicio: new Date(vacacion.fecha_inicio).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }),
                    fecha_fin: new Date(vacacion.fecha_fin).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }),
                    fecha_solicitud: new Date(vacacion.fecha_solicitud).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                };
            });

            res.json(formattedResults);
        });
    });
};

// Actualizar el estado de la solicitud de vacaciones (Aprobado o Rechazado)
exports.updateEstadoVacacion = (req, res) => {
    console.log("Actualizando estado de la solicitud de vacaciones...");

    // Obtener el ID de la vacación desde los parámetros de la URL
    const vacacionId = req.params.id;
    console.log(vacacionId);  // Verifica que el ID se está recibiendo correctamente

    const { estado, descripcion_rechazo } = req.body;

    // Verifica si el estado es "Rechazado" y requiere una descripción de rechazo
    if (estado === 'Rechazado' && !descripcion_rechazo) {
        return res.status(400).json({ error: "Se requiere una descripción para el rechazo" });
    }

    // Si el estado es 'Rechazado', primero insertamos la descripción en la tabla MotivosRechazo
    if (estado === 'Rechazado') {
        const insertQuery = `
            INSERT INTO vacaciones.MotivosRechazo (descripcion) 
            VALUES (?);
        `;
        db.query(insertQuery, [descripcion_rechazo], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Obtener el ID del nuevo motivo de rechazo insertado
            const motivoRechazoId = result.insertId;

            // Ahora actualizamos la tabla Vacaciones con el motivo_rechazo_id y el estado 'Rechazado'
            const updateQuery = `
                UPDATE vacaciones.Vacaciones 
                SET estado = ?, 
                    motivo_rechazo_id = ? 
                WHERE vacacion_id = ?;
            `;
            const values = ['Rechazado', motivoRechazoId, vacacionId];

            db.query(updateQuery, values, (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    message: "Estado de la solicitud de vacaciones actualizado a Rechazado",
                    motivo_rechazo_id: motivoRechazoId // Enviar el ID del motivo de rechazo en la respuesta
                });
            });
        });
    } else if (estado === 'Aprobado') {
        // Si el estado es 'Aprobado', eliminamos la descripción de rechazo
        const query = `
            UPDATE vacaciones.Vacaciones 
            SET estado = ?, 
                motivo_rechazo_id = NULL 
            WHERE vacacion_id = ?;
        `;
        const values = [estado, vacacionId];

        db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Estado de la solicitud de vacaciones actualizado a Aprobado" });
        });
    }
};



