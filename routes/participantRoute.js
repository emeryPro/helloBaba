const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/validateToken');
const {registerParticipant} = require('../controllers/ParticipantController')
const {listParticipantsByActivity} = require('../controllers/ParticipantController.js')
const {listTontinesByParticipant} = require('../controllers/ParticipantController')
const {createTontineForParticipant} = require('../controllers/ParticipantController.js')

router.post('/create_participant', validateToken, registerParticipant);

router.post('/create_tontine', validateToken, createTontineForParticipant);

router.get('/get_participants/:activity_id',validateToken, listParticipantsByActivity);


router.get('/get_tintines_by_participant/:participant_id',validateToken, listTontinesByParticipant);

module.exports = router;