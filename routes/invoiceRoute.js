const express = require('express');
const router = express.Router();
const {createInvoice} = require ('../controllers/InvoiceController')
const { validateToken } = require('../middlewares/validateToken');
const {getInvoiceDetails} = require('../controllers/InvoiceController')
const {getInvoicesByActivityAndStatus} = require('../controllers/InvoiceController')
const {getFormStructureByActivityId} = require('../controllers/InvoiceController')


/* router.post('/create_invoice', validateToken, createInvoice);
router.get('/get_invoives_by_tontine/:tontine_id',validateToken, getInvoicesByTontine);
router.get('/get_invoives_unpaid/:activity_id',validateToken, getUnpaidInvoicesByActivity);
 */
router.get('/invoices/:activity_id/:statut',validateToken, getInvoicesByActivityAndStatus);
router.get('/get_invoice_details/:id',validateToken, getInvoiceDetails);
router.get('/get_invoice_form/:activityId',validateToken, getFormStructureByActivityId);
router.post('/create_invoices', validateToken, createInvoice);




module.exports = router;