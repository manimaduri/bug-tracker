const jwt = require('jsonwebtoken');
const sendResponse = require('../../utils/sendResponse');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (!token) return sendResponse(res, false, 'Invalid Token', 403);
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
            next();
        } catch (err) {
            sendResponse(res, false, 'Invalid Token', 403);
        }
    } else {
        sendResponse(res, false, 'Authorization header must be provided', 401);
    }
};