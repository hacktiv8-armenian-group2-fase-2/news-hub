const express = require('express');
const FavoriteController = require('../controllers/favoriteController');
const router = express.Router();
const {authorization} = require('../middlewares/auth.js')

router.get('/', FavoriteController.toList)
router.post('/', FavoriteController.addData)
router.delete('/:id', authorization, FavoriteController.deleteData)

module.exports = router;