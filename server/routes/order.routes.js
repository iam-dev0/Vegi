import express from 'express';
const router = express.Router();

import OrderController from '../controllers/order.controller';


router.get('/', OrderController.getOrder);
router.post('/:id',OrderController.addToOrder)
router.delete('/:orderId',OrderController.removeOrderProduct)

module.exports = router;
/** this ends this file
* server/routes/clients.routes
**/
