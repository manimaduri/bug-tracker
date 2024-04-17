const pool = require("../db");
const sendResponse = require("../../utils/sendResponse");
const { projects } = require("../queries");

exports.getAllProjects = async (req, res, next) => {
  try {
    const query =
      req.user.role === "admin"
        ? projects.getAllProjects.admin
        : projects.getAllProjects.user;
    const params = req.user.role === "admin" ? [] : [req.user.id];
    const { rows } = await pool.query(query, params);
    sendResponse(res, true, rows);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  const projectId = req.params.id;

  try {
    const { rows } = await pool.query(projects.getProjectById, [projectId]);

    if (rows.length === 0) {
      return sendResponse(res, false, "Project not found", 404);
    }

    const project = {
      id: rows[0].id,
      name: rows[0].name,
      created_by: rows[0].created_by,
      created_at: rows[0].created_at,
      users: rows.filter(row => row.user_id !== null).map((row) => ({
        id: row.user_id,
        username: row.username,
        email: row.email,
        role: row.role,
      })),
    };

    sendResponse(res, true, project);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const { name} = req.body;
    const { id } = req.user;
    const created_by = id;

    const { rows } = await pool.query(projects.createProject, [
      name,
      created_by,
    ]);
    sendResponse(res, true, rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { id, name, description } = req.body;

    let updates = [];
    let params = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      params.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      params.push(description);
    }

    params.push(id);
    const { rows } = await pool.query(
      projects.updateProject(updates, paramIndex),
      params
    );

    if (rows.length > 0) {
      sendResponse(res, true, rows[0]);
    } else {
      sendResponse(res, false, "Project Not Found", 404);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(projects.deleteProject, [id]);
    if (rows.length > 0) {
      sendResponse(res, true, rows[0]);
    } else {
      sendResponse(res, false, "Project Not Found", 404);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
