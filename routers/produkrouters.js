const express = require('express');
const router = express.Router();
const { getProduk, getKemasan } = require('../controllers/producontrollers'); // pastikan path benar

router.get('/', getProduk);        // harus function
router.get('/kemasan', getKemasan);

module.exports = router;
