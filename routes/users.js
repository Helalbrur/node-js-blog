const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/signup', usersController.signupForm);
router.post('/signup', usersController.signup);
router.get('/login', usersController.loginForm);
router.post('/login', usersController.login);
router.get('/logout', usersController.logout);

module.exports = router;
