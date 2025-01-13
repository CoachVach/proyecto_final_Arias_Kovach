const express = require('express');
const router = express.Router();
const {login, register, validateToken} = require('../controllers/authController');


router.post('/login', login );
router.post('/register', register);
router.get('/validate-token', validateToken);

module.exports = router;
