const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { verifyToken, isAdmin } = require('../middleware/auth');
const {
    getProduk,
    tambahBarang,
    getPesananMasuk,
    prosesPesanan,
    getRiwayat,
    getPelanggan
} = require('../controllers/admincontrollers');

// setup multer storage
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name);
    }
});
const upload = multer({ storage });

// Tambah produk / kemasan
router.post('/produk', verifyToken, isAdmin, upload.single('foto'), tambahBarang);

// Produk
router.get('/produk', verifyToken, isAdmin, getProduk);

// Pesanan masuk (✅ diganti pakai verifyToken + isAdmin)
router.get('/pesanan-masuk', verifyToken, isAdmin, getPesananMasuk);

// Pesanan proses
router.put('/pesanan/:id/proses', verifyToken, isAdmin, prosesPesanan);

// Riwayat
router.get('/riwayat', verifyToken, isAdmin, getRiwayat);

// Pelanggan
router.get('/pelanggan', verifyToken, isAdmin, getPelanggan);

module.exports = router;
