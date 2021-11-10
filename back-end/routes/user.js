const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user');
const password = require('../middleware/password');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;