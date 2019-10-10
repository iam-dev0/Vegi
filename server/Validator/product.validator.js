import { body }from 'express-validator';

export const createProduct =  [ 
        body('description', 'Disciption Cannot be empty').exists(),
        body('title', 'Title cannot be empty').exists(),
        body('price',"Required and it must be a number").exists().isFloat(),
        body('stock',"Required and it must be a number").exists().isInt(),
        body('category',"category is required").exists(),
       ]   
