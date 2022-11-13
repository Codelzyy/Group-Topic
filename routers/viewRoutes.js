const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();
// const time = {
//    1: '7:00',
//    2: '7:50',
//    3: '8:40',
//    4: '9:45',
//    5: '10:40',
//    6: '11:45',
//    7: '12:30',
//    8: '13:30',
//    9: '14:20',
//    10: '15:10',
//    11: '16:10',
//    12: '17:10',
//    13: '18:00',
//    14: '19:10',
//    15: '20:00',
// };
router.get('/', authController.isLogged, viewsController.getRegister);
router.get('/course/:id', authController.protect, viewsController.getListCourse);
router.get('/hocphan', authController.protect, viewsController.getHomePage);
router.get('/login', viewsController.getLoginForm);
router.get('/logout', authController.isLogged, viewsController.getLogout);
router.get('/tracuu', authController.protect, viewsController.getSearchCourse);
router.get('/deleteCourse', authController.protect, viewsController.deleteCourse);
//

module.exports = router;
