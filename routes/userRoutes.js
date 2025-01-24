
const express = require('express');
const { User } = require('../models/User');
const router = express.Router();
const UserController= require('../controllers/UserController')
const { validateToken } = require('../middlewares/validateToken');
const {getUsersByDirector} = require('../controllers/UserController')
const {linkUserToActivity} = require('../controllers/UserController')
const {unlinkUserFromActivity} = require('../controllers/UserController')
const {updateUserPermission} = require('../controllers/UserController')
// Route pour créer un utilisateur
router.post('/register', UserController.createUser);

// Recuperer tous les utilisateurs
router.get('/users', UserController.getAllUsers);


//Route pour créer un untilisateur second
router.post('/register_second_user',validateToken,UserController.createSecondUser)

//Route pour lier un utilisateur existant à une activité
router.post('/link_user_to_activity',validateToken,linkUserToActivity)

//Route pour delier un utilisateur d'une activité
router.post('/unlink_user_from_activity',validateToken,unlinkUserFromActivity)

//Route pour recuperer tout les utilisateurs lié à un directeur
router.get('/get_usersBydirector',validateToken, getUsersByDirector);


router.post('/update_user_permission',validateToken,updateUserPermission)

module.exports = router;
