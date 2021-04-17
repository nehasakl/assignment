const express = require("express");
const router = express.Router();
const auth = require("../middleware/isAuth")
const User = require('../app/controllers/user.controller');
router.post('/register', User.register);
router.post('/login', User.login);
router.put('/update', auth, User.updateUser);
router.delete('/delete', auth, User.deleteUser);
router.post('/forgot-password', User.forgotPassword);
module.exports = router;