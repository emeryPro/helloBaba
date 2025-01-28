const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/validateToken');
const {registerPayment} = require('../controllers/ReceiptController')
const {getPaymentDetails} = require('../controllers/ReceiptController')
const {getPaymentsByActivity} = require('../controllers/ReceiptController')
const {getPaymentsByDateRange} = require ('../controllers/ReceiptController')

router.post('/create_receipt', validateToken, registerPayment);

router.get('/get_payement_detail/:paymentId',validateToken, getPaymentDetails);


router.get('/get_payement_byActivity/:activity_id',validateToken, getPaymentsByActivity);

router.get('/get_payement_byDateRange/:activity_id',validateToken, getPaymentsByDateRange);
/* router.post('/create_receipt', validateToken, createReceipt);
 */



module.exports = router;