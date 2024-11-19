const express = require('express') ;
const userController = require('../controller/userController');
const verifyToken = require('../middlware/verifyToken')
const router  = express.Router() ;


router.route('/')
    .get(userController.getAllUsers)
    

router.route('/:id')
    .get( verifyToken  , userController.getUser)
    .patch(verifyToken  ,userController.updateUser )
    .delete( verifyToken  , userController.deleteUser)



module.exports = router ;
