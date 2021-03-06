const express = require('express');
const router = express.Router();
const {authentication} = require('../middlewares/auth.js')

router.use('/users', require('./users.js'))
router.use(authentication)
router.use('/favorites', require('./favorite'))
router.use('/news', require('./news'))

module.exports = router;