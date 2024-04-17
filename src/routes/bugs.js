const {Router} = require('express');
const {getAllBugs,createBug,updateBug,deleteBug,getBugById} = require('../controllers/bugs');
const authMiddleware = require('../middleware/auth');
const isUserAssignedToProject = require('../middleware/isUserAssignedToProject');
const router = Router();

router.get('/',authMiddleware,isUserAssignedToProject,getAllBugs);
router.post('/',authMiddleware,isUserAssignedToProject,createBug);
router.patch('/:id',authMiddleware,isUserAssignedToProject,updateBug);
router.delete('/:id',authMiddleware,isUserAssignedToProject,deleteBug);
router.get('/:id',authMiddleware,isUserAssignedToProject,getBugById);

module.exports = router;