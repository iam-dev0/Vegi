import { body }from 'express-validator';

export const createUser =  [ 
        body('username', 'first_name Cannot be empty').exists(),
        body('email', 'Please enter a valid email address').exists().isEmail(),
        body('password',"Password should be at least 6 character long").exists().isLength({ min: 5 }),
       ]   


export const userLogin =  [ 
body('email', 'Please enter a valid email address').exists().isEmail(),
body('password',"Password should be at least 6 character long").exists().isLength({ min: 5 }),
]   
