const express = require('express');
const User = require('../models/user');
const router = express.Router();

const { isLoggedIn, isAdmin } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');

const admins = require('../controllers/admins');

router.get('/list', isLoggedIn, catchAsync(admins.employeesList))

router.get('/', isLoggedIn, isAdmin, catchAsync(admins.renderAddEmployee));

router.post('/', isLoggedIn, isAdmin, catchAsync(admins.addEmployee));


//router.get('/list', isLoggedIn, async (req, res) => {
//    const users = await User.find()
//    res.render('admin/list', { users })
//})

router.get('/:id', isLoggedIn, isAdmin, catchAsync(admins.renderEdit))

router.post('/:id', isLoggedIn, isAdmin, catchAsync(admins.updateEmployee))




//router.get('/:id', isLoggedIn, async (req, res) => {
//
//    const { id } = req.params;
//    const user = await User.findById(id)
//
//    if (!user) {
//        req.flash('error', 'Cannot find Employee')
//        return res.redirect('admins/list');
//    }
//    res.render('admin/list');
//})



router.delete("/:id", isLoggedIn, isAdmin, catchAsync(admins.deleteEmployee))

router.get('/:id/employees/:eId', isLoggedIn, isAdmin, catchAsync(admins.renderEmployeeAttendence))

router.put('/:id/approved/:ID', isLoggedIn, isAdmin, catchAsync(admins.markApprove))

router.put('/:id/rejected/:ID', isLoggedIn, isAdmin, catchAsync(admins.markReject))



module.exports = router;