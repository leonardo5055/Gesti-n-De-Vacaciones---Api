// routes/admin/vacacionesAdmin.js
const express = require('express');
const router = express.Router();
const vacacionesControllerAdmin = require('../../controllers/admin/vacacionesControllerAdmin');

// Ruta para obtener todas las vacaciones
router.get('/', vacacionesControllerAdmin.getAllVacacionesAdmin);

// Ruta para actualizar el estado de las vacaciones
router.put('/:id/estado', vacacionesControllerAdmin.updateEstadoVacacion);

// Ruta para crear una nueva solicitud de vacaciones
//router.post('/', vacacionesController.createVacacionAdmin);

module.exports = router;
