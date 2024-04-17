const { Router } = require("express");
const {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} = require("../controllers/projects");
const {
  assignUserToProject,
  unassignUserFromProject,
  getAllUsersAssignedToProject,
  getAllUnAssignedUsers,
} = require("../controllers/projectUsers");
const authMiddleware = require("../middleware/auth");
const checkAdmin = require("../middleware/checkAdmin");
const isUserAssignedToProject = require("../middleware/isUserAssignedToProject");

const router = Router();


//id is the project id and userId is the user id

router.get("/", authMiddleware, getAllProjects);
router.post("/", authMiddleware, checkAdmin, createProject);
router.patch("/:id", authMiddleware, checkAdmin, updateProject);
router.delete("/:id", authMiddleware, checkAdmin, deleteProject);
router.get("/:id", authMiddleware, checkAdmin, getProjectById);
router.post(
  "/:id/assign/:userId",
  authMiddleware,
  checkAdmin,
  assignUserToProject
);
router.delete(
  "/:id/unassign/:userId",
  authMiddleware,
  checkAdmin,
  unassignUserFromProject
);

router.get(
  "/:id/users/assigned",
  authMiddleware,
  isUserAssignedToProject,
  getAllUsersAssignedToProject
);
router.get(
  "/:id/users/unassigned",
  authMiddleware,
  checkAdmin,
  getAllUnAssignedUsers
);

module.exports = router;
