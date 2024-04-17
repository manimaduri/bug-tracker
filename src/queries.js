module.exports = {
  users: {
    getAllUsers: "SELECT * FROM users",
    getUserById: "SELECT * FROM users WHERE id = $1",
    createUser:
      "INSERT INTO users (username, email, dob, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    updateUser: (updates, paramIndex) =>
      `UPDATE users SET ${updates.join(
        ", "
      )} WHERE id = $${paramIndex} RETURNING *`,
    deleteUser: "DELETE FROM users WHERE id = $1",
    getUserByEmail: "SELECT * FROM users WHERE email = $1",
  },
  bugs: {
    getAllBugs: "SELECT * FROM bugs",
    // getBugById: 'SELECT * FROM bugs WHERE id = $1',
    getBugById: `
  SELECT bugs.*, 
    created_user.username AS created_by_username, 
    assigned_user.username AS assigned_to_username
  FROM bugs
  LEFT JOIN users AS created_user ON bugs.created_by = created_user.id
  LEFT JOIN users AS assigned_user ON bugs.assigned_to = assigned_user.id
  WHERE bugs.id = $1
`,
    createBug:
      "INSERT INTO bugs (title, description, priority, status, created_by, assigned_to, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    updateBug: (updates, paramIndex) =>
      `UPDATE bugs SET ${updates.join(
        ", "
      )} WHERE id = $${paramIndex} RETURNING *`,
    deleteBug: "DELETE FROM bugs WHERE id = $1",
  },
  comments: {
    getAllComments: "SELECT * FROM comments WHERE bug_id = $1",
    createComment:
      "INSERT INTO comments (comment, user_id, bug_id) VALUES ($1, $2, $3) RETURNING *",
    updateComment: "UPDATE comments SET comment = $1 WHERE id = $2 RETURNING *",
    deleteComment: "DELETE FROM comments WHERE id = $1",
    getCommentById: "SELECT * FROM comments WHERE id = $1",
  },
  projects: {
    getAllProjects: {
      admin: "SELECT * FROM projects",
      user: "SELECT projects.* FROM projects JOIN project_users ON projects.id = project_users.project_id WHERE project_users.user_id = $1",
    },
    getProjectById: `
      SELECT projects.*, users.id AS user_id, users.username, users.email, users.role
      FROM projects
      LEFT JOIN project_users ON projects.id = project_users.project_id
      LEFT JOIN users ON project_users.user_id = users.id
      WHERE projects.id = $1
    `,
    createProject:
      "INSERT INTO projects (name, created_by) VALUES ($1, $2) RETURNING *",
    updateProject: "UPDATE projects SET name = $1  WHERE id = $2 RETURNING *",
    deleteProject: "DELETE FROM projects WHERE id = $1",
  },
  projectUsers: {
    isUserAssignedToProject:
      "SELECT * FROM project_users WHERE user_id = $1 AND project_id = $2",
    assignUserToProject:
      "INSERT INTO project_users (user_id, project_id) VALUES ($1, $2) RETURNING *",
    unassignUserFromProject:
      "DELETE FROM project_users WHERE user_id = $1 AND project_id = $2",
    getAllUsersAssignedToProject: `
  SELECT users.*
  FROM users
  JOIN project_users ON users.id = project_users.user_id
  WHERE project_users.project_id = $1
`,
    getAllUnAssignedUsers: `
  SELECT users.*
  FROM users
  WHERE users.id NOT IN (
    SELECT user_id FROM project_users WHERE project_id = $1
  )`
  },
};
