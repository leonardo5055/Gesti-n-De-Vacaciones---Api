const express = require('express');
const router = express.Router();
const motivosController = require('../controllers/motivosController');

// Ruta para obtener todos los motivos
router.get('/', motivosController.getAllMotivos);

// Ruta para crear un nuevo motivo
router.post('/', motivosController.createMotivo);

module.exports = router;

