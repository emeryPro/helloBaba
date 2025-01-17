const express = require('express');
const router = express.Router();
const { createActivity } = require('../controllers/ActivityController');
const { getGroupActivities } = require('../controllers/GroupActivityController');
const { validateToken } = require('../middlewares/validateToken'); // Middleware de validation du token
const {getUserActivities} = require('../controllers/ActivityController')
const {getActivityUserCount} = require('../controllers/ActivityController')
const {deleteActivity}= require('../controllers/ActivityController')
const {showActivities}= require('../controllers/ActivityController')
const {updateActivityName}= require('../controllers/ActivityController')
// Route protégée, nécessite un token valide et un rôle "Director"
router.post('/create_activities', validateToken, createActivity);

router.get('/group_activities',validateToken, getGroupActivities);

router.get('/get_user_activities',validateToken, getUserActivities);

router.get('/get_activities_users_count',validateToken, getActivityUserCount);

router.get('/activity/:id',validateToken, showActivities);

router.post('/update_activity', validateToken, updateActivityName);

router.delete('/activity/:id',validateToken, deleteActivity);

module.exports = router;
