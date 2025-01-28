const express = require('express');
const router = express.Router();
const {createCustomer} = require('../controllers/CustomerController')
const { validateToken } = require('../middlewares/validateToken');
const {updateCustomer} = require('../controllers/CustomerController')
const {deleteCustomer}= require('../controllers/CustomerController')
const {getCustomersByActivityId}= require('../controllers/CustomerController')

router.post('/create_customers', validateToken, createCustomer);
router.put('/update_customers/:id',validateToken,updateCustomer)
router.delete('/delete_customers/:id',validateToken, deleteCustomer);
router.get('/get_customer_by_activity/:activity_id',validateToken, getCustomersByActivityId);

module.exports = router;