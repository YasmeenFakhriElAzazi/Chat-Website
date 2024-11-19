const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const UserVerification = require('../models/userVerification')
require('dotenv').config();

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ status: 'fail', message: 'Invalid token' });
        }
        
        const userVerification = await UserVerification.findOne({email : decoded.email});
        const user = await User.findOne({email : decoded.email});
        if (user || !userVerification) {
            req.user = user;

        }else if(userVerification){
            req.user = userVerification;

        }else{

            return res.status(404).json({ status: 'fail', message: 'User not found' });
        }

        next();
    } catch (error) {
        return res.status(400).json({ status: 'error', message: error.message });
    }
};

module.exports = authenticateUser;
