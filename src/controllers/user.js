const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendResponse = require("../../utils/sendResponse");
const pool = require("../db");
const { users } = require("../queries");

exports.getAllUsers = async (req, res, next) => {
  try {
    const { rows } = await pool.query(users.getAllUsers);
    sendResponse(res, true, rows);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { username, email, dob, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(users.createUser, [
      username,
      email,
      dob,
      hashedPassword,
      'user',
    ]);
    // Generate JWT token
    const token = jwt.sign({ id: rows[0].id, role : rows[0].role }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRY,
    });
    sendResponse(res, true, { user: rows[0].username,role: rows[0].role, token }, 201);
  } catch (err) {
    console.error(err);
      next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query(users.getUserByEmail, [email]);

    if (rows.length > 0) {
      const user = rows[0];

      // Check if the password is correct
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        // Generate JWT token
        const token = jwt.sign({ id: user.id, role : user.role  }, process.env.JWT_SECRET, {
          expiresIn: process.env.TOKEN_EXPIRY,
        });
        sendResponse(res, true, { username: user.username, token, role: user.role });
      } else {
        sendResponse(res, false, "Invalid email or password", 401);
      }
    } else {
      sendResponse(res, false, "Invalid email or password", 401);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    // Check if the user is trying to update their own details
    const { id, username, email, dob, password } = req.body;

    if (req.user.id !== id) {
      return sendResponse(
        res,
        false,
        "You can only update your own details",
        403
      );
    }
    let updates = [];
    let params = [];
    let paramIndex = 1;

    if (username !== undefined) {
      updates.push(`username = $${paramIndex++}`);
      params.push(username);
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`);
      params.push(email);
    }
    if (dob !== undefined) {
      updates.push(`dob = $${paramIndex++}`);
      params.push(dob);
    }
    if (password !== undefined) {
      updates.push(`password = $${paramIndex++}`);
      params.push(password);
    }

    params.push(id);
    const { rows } = await pool.query(
      users.updateUser(updates, paramIndex),
      params
    );

    if (rows.length > 0) {
      sendResponse(res, true, rows[0]);
    } else {
      sendResponse(res, false, "User Not Found", 404);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return sendResponse(res, false, "Only admins can delete users", 403);
    }
    const { rowCount } = await pool.query(users.deleteUser, [id]);

    if (rowCount > 0) {
      sendResponse(res, true, "User deleted successfully");
    } else {
      sendResponse(res, false, "User Not Found", 404);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(users.getUserById, [id]);

    if (rows.length > 0) {
      sendResponse(res, true, rows[0]);
    } else {
      sendResponse(res, false, "User Not Found", 404);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
