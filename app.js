const express = require('express');
const app = express();
const empleadosRoutes = require('./routes/empleados');
const vacacionesRoutes = require('./routes/vacaciones');
const usuariosRoutes = require('./routes/usuarios'); // Importar rutas de usuarios

app.use(express.json());

// Rutas
app.use('/api/empleados', empleadosRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/usuarios', usuariosRoutes); // Usar rutas de usuarios

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});
