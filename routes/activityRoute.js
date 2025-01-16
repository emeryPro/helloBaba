const express = require('express');
const router = express.Router();
const { createActivity } = require('../controllers/ActivityController');
const { getGroupActivities } = require('../controllers/GroupActivityController');
const { validateToken } = require('../middlewares/validateToken'); // Middleware de validation du token
const {getUserActivities} = require('../controllers/ActivityController')
// Route protégée, nécessite un token valide et un rôle "Director"
router.post('/create_activities', validateToken, createActivity);

router.get('/group_activities',validateToken, getGroupActivities);

router.get('/get_user_activities',validateToken, getUserActivities);

module.exports = router;
