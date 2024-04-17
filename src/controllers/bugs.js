const pool = require("../db");
const sendResponse = require("../../utils/sendResponse");
const { bugs, projectUsers } = require("../queries");

exports.getAllBugs = async (req, res, next) => {
    
  try {
    const { rows } = await pool.query(bugs.getAllBugs);
    sendResponse(res, true, rows);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getBugById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(bugs.getBugById, [id]);
    if (rows.length > 0) {
      const bug = rows[0];
      bug.created_by = { id: bug.created_by, username: bug.created_by_username };
      bug.assigned_to = { id: bug.assigned_to, username: bug.assigned_to_username };
      delete bug.created_by_username;
      delete bug.assigned_to_username;
      sendResponse(res, true, bug);
    } else {
      sendResponse(res, false, "Bug not found", 404);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createBug = async (req, res, next) => {
  try {
    const { title, description, priority, status, assigned_to, project_id } =
      req.body;
    const { id } = req.user;
    const created_by = id;
    if (!project_id) {
      return sendResponse(res, false, "Please select a project", 400);
    }
    const { rows } = await pool.query(bugs.createBug, [
      title,
      description,
      priority,
      status,
      created_by,
      assigned_to,
      project_id,
    ]);
    sendResponse(res, true, rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updateBug = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const { title, description, priority, status, assigned_to } = req.body;

    // Fetch the bug from the database
    const bugResult = await pool.query(bugs.getBugById, [id]);
    if (bugResult.rows.length === 0) {
      return sendResponse(res, false, "Bug Not Found", 404);
    }

    const bug = bugResult.rows[0];

    // Check if the user is authorized to update the bug
    if ((bug.assigned_to.id !== userId && bug.created_by.id !== userId) && (req.user.role !== "admin") ){
      return sendResponse(res, false, "Not authorized to update this bug", 403);
    }

    let updates = [];
    let params = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      params.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      params.push(description);
    }
    if (priority !== undefined) {
      updates.push(`priority = $${paramIndex++}`);
      params.push(priority);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${paramIndex++}`);
      params.push(assigned_to);
    }

    params.push(id);
    const { rows } = await pool.query(
      bugs.updateBug(updates, paramIndex),
      params
    );

    // If the update was successful, rows[0] will contain the updated bug
    sendResponse(res, true, rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(bugs.deleteBug, [id]);
    if (rows.length > 0) {
      sendResponse(res, true, rows[0]);
    } else {
      sendResponse(res, false, "Bug Not Found", 404);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
