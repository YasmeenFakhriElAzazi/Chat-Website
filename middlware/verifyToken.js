require('dotenv').config()
const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        return res.status(400).json({ status: httpStatusText.ERROR, message: 'Token is required' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const currentUser = jwt.verify(token, process.env.SECRET_KEY);
        
        req.currentUser = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({ status: httpStatusText.ERROR, message: 'Invalid token' });
    }
};

module.exports = verifyToken;
