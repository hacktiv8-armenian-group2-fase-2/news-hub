const express = require('express');
const router = express.Router();
const {authentication} = require('../middlewares/auth.js')

router.use('/users', require('./users.js'))

module.exports = router;