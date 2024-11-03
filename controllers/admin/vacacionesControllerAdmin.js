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
