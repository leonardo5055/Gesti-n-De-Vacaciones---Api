const express = require('express');
require('dotenv').config();
const app = express();
const empleadosRoutes = require('./routes/empleados');
const vacacionesRoutes = require('./routes/vacaciones');
const usuariosRoutes = require('./routes/usuarios'); // Importar rutas de usuarios
const motivosRoutes = require('./routes/motivos');

const vacacionesRoutesAdmin = require('./routes/admin/vacacionesAdmin');

const cors = require('cors');

app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/empleados', empleadosRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/usuarios', usuariosRoutes); // Usar rutas de usuarios
app.use('/api/motivos', motivosRoutes);

// Rutas admin
app.use('/api/admin/vacaciones', vacacionesRoutesAdmin);

// Servidor
const PORT = process.env.DB_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
