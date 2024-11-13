//empleados.js
const express = require('express');
const router = express.Router();
const cargoController = require('../controllers/cargoController');

// Ruta para obtener todos los empleados
router.get('/', cargoController.getAllCargos);

// Ruta para crear un empleado
router.post('/', cargoController.createCargo);

module.exports = router;
