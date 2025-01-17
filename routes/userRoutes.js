
const express = require('express');
const { User } = require('../models/User');
const router = express.Router();
const UserController= require('../controllers/UserController')
const { validateToken } = require('../middlewares/validateToken');
const {getUsersByDirector} = require('../controllers/UserController')
const {linkUserToActivity} = require('../controllers/UserController')
// Route pour créer un utilisateur
router.post('/register', UserController.createUser);

// Recuperer tous les utilisateurs
router.get('/users', UserController.getAllUsers);


//Route pour créer un untilisateur second
router.post('/register_second_user',validateToken,UserController.createSecondUser)


router.post('/link_user_to_activity',validateToken,linkUserToActivity)

router.get('/get_usersBydirector',validateToken, getUsersByDirector);


module.exports = router;
