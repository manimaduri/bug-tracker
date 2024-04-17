const {Router} = require('express');
const {getAllCommentsByBugId,createComment,updateComment,deleteComment} = require('../controllers/comments');
const authMiddleware = require('../middleware/auth');
const isUserAssignedToProject = require('../middleware/isUserAssignedToProject');
const router = Router();

router.get('/:id',authMiddleware,isUserAssignedToProject,getAllCommentsByBugId);
router.post('/',authMiddleware,isUserAssignedToProject,createComment);
router.patch('/:id',authMiddleware,isUserAssignedToProject,updateComment);
router.delete('/:id',authMiddleware,isUserAssignedToProject,deleteComment);
// router.get('/:id',authMiddleware,isUserAssignedToProject,getCommentById); this route is not implemented yet

module.exports = router;