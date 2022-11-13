const express = require('express');
const router = express.Router();
const { subjectController } = require('./../controllers');
router
   .route('/:id')
   .get(subjectController.getSubject)
   .patch(subjectController.updateSubject)
   .delete(subjectController.deleteSubject);

router.route('/').get(subjectController.getAllSubjects).post(subjectController.createSubject);

module.exports = router;
