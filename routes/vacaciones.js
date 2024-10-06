const express = require('express');
const router = express.Router();
const vacacionesController = require('../controllers/vacacionesController');

// Ruta para obtener todas las vacaciones
router.get('/', vacacionesController.getAllVacaciones);

// Ruta para crear una nueva solicitud de vacaciones
router.post('/', vacacionesController.createVacacion);

module.exports = router;
