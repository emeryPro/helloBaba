const express = require('express');
const { Enterprise } = require('../models/Enterprise');
const router = express.Router();
const {getEnterpriseById}= require('../controllers/EnterpriseController')
const {createEnterprise}= require('../controllers/EnterpriseController')
const {updateEnterprise}= require('../controllers/EnterpriseController')
const { validateToken } = require('../middlewares/validateToken');

// Route pour créer un utilisateur
router.post('/enterprises', validateToken,  createEnterprise);

// Recuperer tous les utilisateurs
router.get('/enterprises/:enterpriseId', validateToken, getEnterpriseById);

router.put('/enterprises/:enterpriseId', validateToken, updateEnterprise);


module.exports = router;
