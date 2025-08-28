const db = require("../models/db");

exports.tambahKeKeranjang = async (req, res) => {
  const { itemId, kategori } = req.body;
  const userId = req.user.id; // Didapat dari middleware verifyToken

  if (!itemId || !kategori) {
    return res.status(400).json({ message: "Item dan kategori wajib diisi." });
  }

  try {
    // Cek apakah item sudah ada di keranjang
    const [existing] = await db.query(
      "SELECT id, jumlah FROM keranjang WHERE user_id = ? AND item_id = ? AND kategori = ?",
      [userId, itemId, kategori]
    );

    if (existing.length > 0) {
      // Jika sudah ada, tambahkan jumlahnya
      const newJumlah = existing[0].jumlah + 1;
      await db.query("UPDATE keranjang SET jumlah = ? WHERE id = ?", [newJumlah, existing[0].id]);
      res.status(200).json({ message: "Jumlah barang di keranjang diperbarui." });
    } else {
      // Jika belum ada, tambahkan item baru
      await db.query(
        "INSERT INTO keranjang (user_id, item_id, kategori, jumlah) VALUES (?, ?, ?, 1)",
        [userId, itemId, kategori]
      );
      res.status(201).json({ message: "Barang berhasil ditambahkan ke keranjang." });
    }
  } catch (err) {
    console.error("Error menambah ke keranjang:", err);
    res.status(500).json({ message: "Gagal menambahkan barang ke keranjang." });
  }
};

exports.getKeranjang = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT
        k.id, k.jumlah, k.kategori,
        p.nama AS nama_item, p.harga AS harga_satuan, p.foto AS foto_item
       FROM keranjang k
       JOIN produk p ON k.item_id = p.id
       WHERE k.user_id = ?`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error mengambil keranjang:", err);
    res.status(500).json({ message: "Gagal mengambil data keranjang." });
  }
};

exports.hapusDariKeranjang = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [result] = await db.query("DELETE FROM keranjang WHERE id = ? AND user_id = ?", [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item tidak ditemukan di keranjang." });
    }

    res.json({ message: "Barang berhasil dihapus dari keranjang." });
  } catch (err) {
    console.error("Error menghapus dari keranjang:", err);
    res.status(500).json({ message: "Gagal menghapus barang dari keranjang." });
  }
};