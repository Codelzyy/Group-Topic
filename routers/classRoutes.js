const express = require('express');
const router = express.Router();
const { classController } = require('./../controllers');
router
   .route('/:id')
   .get(classController.getClass)
   .patch(classController.updateClass)
   .delete(classController.deleteClass)
   .post(classController.AddStudent);

router.route('/').get(classController.getAllClasses).post(classController.createClass);

module.exports = router;
