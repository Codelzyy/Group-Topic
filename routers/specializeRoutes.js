const express = require('express');
const router = express.Router();
const { specializeController } = require('./../controllers');
router
   .route('/:id')
   .get(specializeController.getSpecialize)
   .patch(specializeController.updateSpecialize)
   .delete(specializeController.deleteSpecialize);

router.route('/').get(specializeController.getAllSpecializes).post(specializeController.createSpecialize);

module.exports = router;
