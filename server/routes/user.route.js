const express = require('express');

const router = new express.Router();

const userController = require('../controllers/user.controller');

router.post('/login', userController.login);
router.post('/signup', userController.signup);

module.exports = router;