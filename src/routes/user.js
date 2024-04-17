const { Router } = require('express');
const {getAllUsers,
    createUser,
    updateUser,
    getUserById,
    deleteUser,
    loginUser,
} = require("../controllers/user");
const authMiddleware = require('../middleware/auth');

const router = Router();

router.get('/',authMiddleware, getAllUsers);
router.post('/register', createUser);
router.patch('/',authMiddleware, updateUser);
router.post('/login', loginUser);
router.delete('/:id', authMiddleware,deleteUser);
router.get('/:id',authMiddleware, getUserById);

module.exports = router;