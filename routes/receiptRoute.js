const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/validateToken');
const {createReceipt} = require('../controllers/ReceiptController.js')


router.post('/create_receipt', validateToken, createReceipt);


module.exports = router;