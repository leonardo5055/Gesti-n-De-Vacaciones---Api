//app.js
const express = require('express');
require('dotenv').config();
const app = express();
const empleadosRoutes = require('./routes/empleados');
const vacacionesRoutes = require('./routes/vacaciones');
const usuariosRoutes = require('./routes/usuarios'); // Importar rutas de usuarios
const motivosRoutes = require('./routes/motivosVacaciones');
const cargoRoutes = require('./routes/cargo');

const vacacionesRoutesAdmin = require('./routes/admin/vacacionesAdmin');

const cors = require('cors');

app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/empleados', empleadosRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/usuarios', usuariosRoutes); // Usar rutas de usuarios
app.use('/api/motivos', motivosRoutes);
app.use('/api/cargo', cargoRoutes);

// Rutas admin
app.use('/api/admin/vacaciones', vacacionesRoutesAdmin);



// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Servidor
const PORT = process.env.DB_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
