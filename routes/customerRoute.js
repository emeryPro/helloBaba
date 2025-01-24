const express = require('express');
const router = express.Router();
const {createCustomer} = require('../controllers/CustomerController')
const { validateToken } = require('../middlewares/validateToken');
const {updateCustomer} = require('../controllers/CustomerController')
const {deleteCustomer}= require('../controllers/CustomerController')



router.post('/create_customers', validateToken, createCustomer);
router.put('/update_customers/:id',validateToken,updateCustomer)
router.delete('/delete_customers/:id',validateToken, deleteCustomer);

module.exports = router;