const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const employees = require('../controllers/employees');
const { isLoggedIn } = require('../middleware');


router.route('/:id')
    .get(catchAsync(employees.renderCheckIn))
    .post(isLoggedIn, catchAsync(employees.editProfile))



router.route('/:id/attendence')
    .post(catchAsync(employees.markCkeckIn))
    .get(isLoggedIn, catchAsync(employees.renderCheckout))

router.route('/:id/onleave')
    .post(catchAsync(employees.onleave))

router.route('/:id/checkOut')
    .post(catchAsync(employees.markCheckout))


router.route('/:id/profile')
    .get(isLoggedIn, catchAsync(employees.viewProfile))

router.route('/:id/changepassword')
    .get(isLoggedIn, catchAsync(employees.changePasswrd))
router.route('/:id/cp')
    .post(isLoggedIn, catchAsync(employees.setPassword))




module.exports = router;