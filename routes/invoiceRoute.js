const express = require('express');
const router = express.Router();
const {createInvoice}= require('../controllers/InvoiceController')
const { validateToken } = require('../middlewares/validateToken'); 
const { getInvoicesByTontine } =require('../controllers/InvoiceController')
const {getUnpaidInvoicesByActivity} = require ('../controllers/InvoiceController')

router.post('/create_invoice', validateToken, createInvoice);
router.get('/get_invoives_by_tontine/:tontine_id',validateToken, getInvoicesByTontine);
router.get('/get_invoives_unpaid/:activity_id',validateToken, getUnpaidInvoicesByActivity);

module.exports = router;