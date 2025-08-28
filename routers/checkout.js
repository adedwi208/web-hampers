const express = require('express');
const router = express.Router();
const pool = require('../models/db'); // koneksi MySQL
const authMiddleware = require('../middleware/auth');

// POST checkout
router.post('/', authMiddleware, async (req, res) => {
    const { nama, no_hp, email, alamat, metode_pembayaran, total_harga } = req.body;
    const user_id = req.user.id; // dari token auth

    if (!nama || !no_hp || !email || !alamat || !metode_pembayaran || !total_harga) {
        return res.status(400).json({ message: "Semua data harus diisi" });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO pesanan (user_id, nama, no_hp, email, alamat, metode_pembayaran, total_harga) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, nama, no_hp, email, alamat, metode_pembayaran, total_harga]
        );

        const pesananId = result.insertId;

        res.json({
            message: "Checkout berhasil",
            resi: {
                id_pesanan: pesananId,
                admin_no_hp: "081234567890" // bisa diambil dari DB admin
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal checkout" });
    }
});

module.exports = router;
