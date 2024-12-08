const express = require('express') ;
const userController = require('../controller/userController');
const verifyToken = require('../middlware/verifyToken')
const authenticateUser = require('../middlware/authenticateUser');
const upload = require('../utils/fileUpload');

const router  = express.Router() ;


router.route('/')
        .get(authenticateUser , userController.getUsersForSidebar)
router.route('/search')
        .get(authenticateUser , userController.searchUsersByName)

router.route('/:id')
        .get( verifyToken  , userController.getUser)
        .patch(verifyToken  ,userController.updateUser )
        .delete( verifyToken  , userController.deleteUser)

router.route('/contacts/:id')
        .post(authenticateUser, userController.addUserToAccount) // Add user to contact list
        .delete(authenticateUser, userController.removeUserFromContactList); // Remove user from contact list

router.route('/upload-photo')
        .post(authenticateUser , upload.single("photo") , userController.uploadPhoto  )


module.exports = router ;
