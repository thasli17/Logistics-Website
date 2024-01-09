const express = require('express');
const admin = express.Router();

const adminController = require('../controller/adminController');
const forgotPassword = require('../controller/forgotPassword');

admin.get('/login',adminController.loginGet)
admin.post('/login',adminController.loginPost)
admin.get('/dashboard',adminController.adminDashboard)

// forgot password and reset password

admin.get('/forgotPassword',forgotPassword.resetPassword);
admin.post('/forgotPassword',forgotPassword.resetPasswordPost)
admin.get('/reset/:token',forgotPassword.updatePassword)
admin.post('/resetPassword/:token',forgotPassword.updatePasswordPost)


module.exports = admin;