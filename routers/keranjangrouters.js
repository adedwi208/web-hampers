const express = require("express");
const router = express.Router();
const keranjangController = require("../controllers/keranjangcontrollers");
const { verifyToken } = require("../middleware/auth");

// Rute untuk menambah barang ke keranjang
router.post("/", verifyToken, keranjangController.tambahKeKeranjang);

// Rute untuk mendapatkan isi keranjang
router.get("/", verifyToken, keranjangController.getKeranjang);

// Rute untuk menghapus barang dari keranjang
router.delete("/:id", verifyToken, keranjangController.hapusDariKeranjang);

module.exports = router;