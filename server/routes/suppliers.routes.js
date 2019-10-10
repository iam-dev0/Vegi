import express from "express";

import suppliersController from '../controllers/suppliers.controller';
const router = express.Router();



router.get('/', suppliersController.getSuppliers);
router.get('/:id', suppliersController.getSupplier);

router.post('/', suppliersController.createSupplier);

router.delete('/:id', suppliersController.deleteSupplier);

router.put('/:id', suppliersController.editSupplier);

module.exports = router;

/** this ends this file
* server/routes/suppliers.routes
**/
