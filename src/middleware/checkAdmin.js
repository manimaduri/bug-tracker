const sendResponse = require("../../utils/sendResponse");

const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      console.log(req.user.id);
      return sendResponse(res, false, "Unauthorized", 403);
    }
    next();
  };

module.exports = checkAdmin;