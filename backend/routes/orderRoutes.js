const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');


router.post('/', auth, orderController.placeOrder);
router.get('/myorders', auth, orderController.getMyOrders);
router.delete('/:id', auth, orderController.cancelOrder);
// Admin: get all orders
router.get('/', auth, admin, orderController.getAllOrders);

module.exports = router;
