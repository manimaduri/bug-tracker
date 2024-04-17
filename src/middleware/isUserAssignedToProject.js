const pool = require("../db");
const { projectUsers } = require("../queries");
const sendResponse = require("../../utils/sendResponse");

module.exports = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params?.project_id || req.body?.project_id;
  const isAdmin = req.user.role === "admin";

  // If the user is an admin, they are authorized to access any project
  if (isAdmin) {
    return next();
  }

  try {
    const { rows } = await pool.query(projectUsers.isUserAssignedToProject, [userId, projectId]);
    if (rows.length > 0) {
      // The user is assigned to the project, so they are authorized to access it
      return next();
    } else {
      // The user is not assigned to the project, so they are not authorized to access it
      return sendResponse(res, false, "You are not authorized to access this project", 403);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};