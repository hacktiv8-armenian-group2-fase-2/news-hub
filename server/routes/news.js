const express = require('express');
const NewsController = require('../controllers/newsController');
const router = express.Router();

router.get('/', NewsController.toList)

module.exports = router;