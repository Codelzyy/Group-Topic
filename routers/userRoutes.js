const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router
   .route('/:id')
   .get(userController.getUser)
   .patch(userController.updateUser)
   .delete(userController.deleteUser);

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router.route('/login').post(userController.fakeLogin);
module.exports = router;
