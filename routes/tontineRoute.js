const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/validateToken');

/* const {getTontineDetails} = require('../controllers/TontineController')

router.get('/get_all_tontines_info/:tontine_id',validateToken, getTontineDetails);
 */
module.exports = router;