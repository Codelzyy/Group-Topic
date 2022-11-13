const express = require('express');
const router = express.Router();
const { facultyController } = require('./../controllers');
router
   .route('/:id')
   .get(facultyController.getFaculty)
   .patch(facultyController.updateFaculty)
   .delete(facultyController.deleteFaculty);

router.route('/').get(facultyController.getAllFaculties).post(facultyController.createFaculty);

module.exports = router;
