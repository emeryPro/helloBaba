const express = require('express');
const router = express.Router();
const { getRoles } = require('../controllers/RoleController');
const { validateToken } = require('../middlewares/validateToken');
// Route pour récupérer les rôles non admin et non director
router.get('/such_roles',validateToken, getRoles);

module.exports = router;
