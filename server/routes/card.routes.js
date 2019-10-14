import express from 'express';
const router = express.Router();

import cardController from '../controllers/card.controller';


router.get('/:id', cardController.getCard);
router.post('/:id',cardController.addToCard)
router.delete('/:userId/:productId',cardController.removeCardProduct)
router.put('/incqty',cardController.incrementQuantity)
router.put('/decqty',cardController.decrementQuantity)
module.exports = router;
/** this ends this file
* server/routes/clients.routes
**/
