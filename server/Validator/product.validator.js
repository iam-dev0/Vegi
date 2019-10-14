import { body }from 'express-validator';

export const createProduct =  [ 
        body('title', 'Title cannotbe empty').exists(),
        body('price',"Required and it must be a number").exists().isFloat(),
       ]   
