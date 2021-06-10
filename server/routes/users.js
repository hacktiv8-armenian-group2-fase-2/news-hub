const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.post('/', UserController.register)
router.post('/login', UserController.login)
router.post('/login-google', UserController.loginGoogle)

module.exports = router;