// routes/admin/vacacionesAdmin.js
const express = require('express');
const router = express.Router();
const empleadosControllerAdmin = require('../../controllers/admin/empleadosControllerAdmin');


// Ruta para actualizar los empleados
router.put('/:empleado_id', empleadosControllerAdmin.updateEmpleado);


module.exports = router;
