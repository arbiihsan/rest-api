const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const {
  validateCreateUser,
  validateUpdateUser
} = require('../validators/userValidator');

// public
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateUpdateUser, updateUser);
router.delete('/:id', deleteUser);

// private
router.get('/', authMiddleware, getAllUsers);
router.get('/:id', authMiddleware, getUserById);

module.exports = router;
