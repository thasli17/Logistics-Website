const express = require('express');
const user = express.Router();
const userController = require('../controller/userController');


user.get('/',userController.home)



module.exports = user