// routers/pesananrouters.js
const express = require('express');
const router = express.Router();
const pesananController = require('../controllers/pesanancontrollers');
const { verifyToken } = require('../middleware/auth');

router.post('/checkout', verifyToken, pesananController.checkout);

module.exports = router;