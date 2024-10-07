//empleados.js
const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/empleadosController');

// Ruta para obtener todos los empleados
router.get('/', empleadosController.getAllEmpleados);

// Ruta para crear un empleado
router.post('/', empleadosController.createEmpleado);

// Ruta para obtener un empleado por ID
router.get('/:id', empleadosController.getEmpleadoById);

module.exports = router;
