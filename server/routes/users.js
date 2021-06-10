const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/login-google', UserController.loginGoogle)
router.post('/login-captcha', UserController.loginCaptcha)

module.exports = router;