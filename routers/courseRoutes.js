const express = require('express');
const router = express.Router();
const { courseController, authController } = require('./../controllers');
router.get('/enroll', courseController.MyCourse);

router
   .route('/:id')
   .get(courseController.getCourse)
   .patch(courseController.updateCourse)
   .delete(courseController.deleteCourse);
router
   .route('/')
   .get(authController.protect, courseController.getAllCourses)
   .post(courseController.createCourse);

//
router
   .route('/enroll/:id')
   .post(authController.protect, courseController.EnrollCourse)
   .patch(authController.protect, courseController.DeleteEnrollCourse)
   .put(authController.protect, courseController.UpdateScore);

module.exports = router;
