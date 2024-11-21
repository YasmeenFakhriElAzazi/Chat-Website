const express = require('express') ;

const router  = express.Router() ;
const messageController = require('../controller/messageController');
const authenticateUser = require('../middlware/authenticateUser');

router.route('/send/:id')
                .post(authenticateUser ,  messageController.sendMessage)
router.route('/:id')
                .get(authenticateUser ,  messageController.getMessages)
             

module.exports = router ; 

