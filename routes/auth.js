const express = require('express') ;

const router  = express.Router() ;
const auth = require('../controller/auth');
const authenticateUser = require('../middlware/authenticateUser');


router.route('/register')
                .post(auth.register)
             
router.route('/login')
                .post(auth.login)
             
router.route('/verify')
                .post(authenticateUser , auth.verifyUser)
module.exports = router ; 

