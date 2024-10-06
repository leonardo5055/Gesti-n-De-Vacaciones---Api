const express = require('express');
require('dotenv').config();
const app = express();
const empleadosRoutes = require('./routes/empleados');
const vacacionesRoutes = require('./routes/vacaciones');
const usuariosRoutes = require('./routes/usuarios'); // Importar rutas de usuarios
const cors = require('cors');

app.use(express.json());

// Rutas
app.use(cors());
app.use('/api/empleados', empleadosRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/usuarios', usuariosRoutes); // Usar rutas de usuarios

// Servidor
const PORT = process.env.DB_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
