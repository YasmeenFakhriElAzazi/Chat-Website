const {body} = require('express-validator')
exports.validationSchema = ()=>{
   return  [
        body('fullName')
            .notEmpty()
            .withMessage('name is required'),
        body('email')
            .notEmpty()
            .withMessage('email is required') ,
        body('password')
            .notEmpty() 
            .withMessage('password is required')    
    ]
}