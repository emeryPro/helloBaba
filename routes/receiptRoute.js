const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/validateToken');
const {registerPayment} = require('../controllers/ReceiptController')

router.post('/create_receipt', validateToken, registerPayment);
/* router.post('/create_receipt', validateToken, createReceipt);
 */



module.exports = router;