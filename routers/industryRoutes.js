const express = require('express');
const router = express.Router();
const { industryController } = require('./../controllers');
router
   .route('/:id')
   .get(industryController.getIndustry)
   .patch(industryController.updateIndustry)
   .delete(industryController.deleteIndustry);

router.route('/').get(industryController.getAllIndustries).post(industryController.createIndustry);

module.exports = router;
