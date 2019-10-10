import express from "express";
import { check, validationResult } from 'express-validator';
import upload from '../multer/product'
import {createProduct} from '../Validator/product.validator'
import productsController from '../controllers/product.controller'
import sendUploadToGCS from "../googlecloudservice/product"

const router = express.Router();

//Done-documentation
router.get('/', productsController.getProductsPagination);
//Documentation-1
router.post('/:id',upload, createProduct,sendUploadToGCS, productsController.createProduct);

router.post('/favorite/:userid/:productid',productsController.AddFavoriteProduct)
router.get('/favorite/:userid',productsController.GetFavoriteProducts)
router.delete('/favorite/:userid/:productid',productsController.removeFavoriteProduct)
router.get('/search',productsController.searchProduct)
// router.get('/:page', productsController.getProductsPagination);

// router.get('/count', productsController.getCount);
// router.get('/actives', productsController.getActives);
// router.get('/actives/count', productsController.getActivesCount);
// router.get('/inactives', productsController.getInactives);
// router.get('/inactives/count', productsController.getActivesCount);
// router.get('/brokenstock', productsController.brokenStock);
// router.get('/:id', productsController.getProduct);
// router.get('/activate/:id', productsController.activateProduct);
// router.get('/deactivate/:id', productsController.deactivateProduct);

router.put('/:id', productsController.editProduct);
/*
    send as request body:

    {
        "image": "https://unsplash.com/photos/yC-Yzbqy7PY"
    }
*/
router.put('/addimage/:id', productsController.addImage);



router.delete('/:id', productsController.deleteProduct);

module.exports = router;

/** this ends this file
* server/routes/product.routes
**/
 