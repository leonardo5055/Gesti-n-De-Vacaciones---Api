const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

// Ruta para iniciar sesión
router.post('/login', usuariosController.login);

module.exports = router;
