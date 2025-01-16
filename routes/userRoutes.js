
const express = require('express');
const { User } = require('../models/User');
const router = express.Router();
const UserController= require('../controllers/UserController')
const { validateToken } = require('../middlewares/validateToken');

// Route pour créer un utilisateur
router.post('/register', UserController.createUser);

// Recuperer tous les utilisateurs
router.get('/users', UserController.getAllUsers);


//Route pour créer un untilisateur second
router.post('/register_second_user',validateToken,UserController.createSecondUser)

module.exports = router;
