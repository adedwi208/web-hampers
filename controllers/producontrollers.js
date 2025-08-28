const pool = require('../models/db');

// GET produk
const getProduk = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, nama, deskripsi, harga, foto FROM produk WHERE kategori = ?',
            ['produk']
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengambil produk' });
    }
};

// GET kemasan
const getKemasan = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, nama, deskripsi, harga, foto FROM produk WHERE kategori = ?',
            ['kemasan']
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal mengambil kemasan' });
    }
};

module.exports = { getProduk, getKemasan }; // wajib export object
