const express = require('express');
const router = express.Router();
const { loginUser }  = require('../controllers/AuthController');

// Route de connexion
router.post('/login', loginUser);

module.exports = router;
