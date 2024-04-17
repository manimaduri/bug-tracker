const pool = require("../db");
const sendResponse = require("../../utils/sendResponse");
const { projectUsers } = require("../queries");

exports.assignUserToProject = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      projectUsers.assignUserToProject,
      [req.params.userId, req.params.id]
    );
    if (rows.length === 0) {
        return sendResponse(res, false, "User not found", 404);
      }
    sendResponse(res, true, rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.unassignUserFromProject = async (req, res, next) => {
  try {
    const result = await pool.query(projectUsers.unassignUserFromProject, [
        req.params.userId,
        req.params.id,
      ]);
  
      if (result.rowCount === 0) {
        return sendResponse(res, false, "User or project not found", 404);
      }
    sendResponse(res, true, "User unassigned from project");
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getAllUsersAssignedToProject = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const { rows } = await pool.query(projectUsers.getAllUsersAssignedToProject, [id]);
      if (rows.length > 0) {
        sendResponse(res, true, rows);
      } else {
        sendResponse(res, false, "No users assigned to this project", 404);
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  exports.getAllUnAssignedUsers = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const { rows } = await pool.query(projectUsers.getAllUnAssignedUsers, [id]);
        sendResponse(res, true, rows); 
      
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
