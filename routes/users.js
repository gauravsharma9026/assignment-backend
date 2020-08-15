const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

router.post('/csvupload', UserController.csvUpload);

router.get("/", UserController.getUsers);


module.exports = router;
