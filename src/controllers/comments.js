const pool = require("../db");
const sendResponse = require("../../utils/sendResponse");
const { comments } = require("../queries");

exports.getAllCommentsByBugId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { rows } = await pool.query(comments.getAllComments, [id]);
      sendResponse(res, true, rows);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

  
// Create a new comment
exports.createComment = async (req, res, next) => {
    try {
        const user_id = req.user.id;
      const { bug_id, comment } = req.body;
      const { rows } = await pool.query(comments.createComment, [ comment, user_id, bug_id]);
      sendResponse(res, true, rows[0]);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  
  // Update a comment
exports.updateComment = async (req, res, next) => {
    try {
      const user_id = req.user.id;
      const { id } = req.params;
      const { comment } = req.body;
  
      // Fetch the comment from the database
      const commentResult = await pool.query(comments.getCommentById, [id]);
  
      // Check if the comment exists
      if (commentResult.rows.length === 0) {
        sendResponse(res, false, "Comment not found", 404);
        return;
      }
  
      // Check if the user_id of the comment matches the user_id from req.user.id
      if (commentResult.rows[0].user_id !== user_id) {
        sendResponse(res, false, "You are not authorized to edit this comment", 403);
        return;
      }
  
      const updateResult = await pool.query(comments.updateComment, [comment, id]);
      sendResponse(res, true, updateResult.rows[0]);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };
  
  // Delete a comment
  exports.deleteComment = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { rowCount } = await pool.query(comments.deleteComment, [id]);
      if (rowCount === 0) {
        sendResponse(res, false, "Comment not found", 404);
      } else {
        sendResponse(res, true, "Comment deleted successfully");
      }
    } catch (err) {
      console.error(err);
      next(err);
    }
  };