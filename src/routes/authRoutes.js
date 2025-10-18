const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { validateLogin } = require('../validators/userValidator');

// POST /login
router.post('/', validateLogin, login);

module.exports = router;
