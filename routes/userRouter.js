const express = require('express') ;
const userController = require('../controller/userController');
const verifyToken = require('../middlware/verifyToken')
const authenticateUser = require('../middlware/authenticateUser');

const router  = express.Router() ;


router.route('/')
    .get(authenticateUser , userController.getUsersForSidebar)
    

router.route('/:id')
    .get( verifyToken  , userController.getUser)
    .patch(verifyToken  ,userController.updateUser )
    .delete( verifyToken  , userController.deleteUser)



module.exports = router ;
