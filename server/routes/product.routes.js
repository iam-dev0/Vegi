import express from "express";
import { check, validationResult } from 'express-validator';
import {createProduct} from '../Validator/product.validator'
import productsController from '../controllers/product.controller'
import upload from '../multer/upload'
const router = express.Router();


router.get('/', productsController.getProductsPagination);
router.post('/:id',upload, createProduct, productsController.createProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;

