const express = require('express');
const authGoogle = require('../middlewares/auth');
const userController = require('../controllers/userController');
const router = express.Router();

// router.post('/google', authGoogle, userController.googleSignup);
module.exports = router;
