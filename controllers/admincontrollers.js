// controllers/adminController.js
const db = require('../models/db');

exports.getProduk = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM produk ORDER BY created_at DESC');
    for (let p of rows) {
      const [v] = await db.query('SELECT jenis_varian, nilai FROM produk_varian WHERE produk_id = ?', [p.id]);
      p.varian = v;
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal ambil produk' });
  }
};

exports.tambahBarang = async (req, res) => {
  const conn = await db.getConnection();
  await conn.beginTransaction();
  try {
    const { nama, deskripsi, harga, kategori } = req.body; // ✅ Ambil kategori
    const varian = req.body.varian ? JSON.parse(req.body.varian) : [];
    const foto = req.file ? req.file.filename : null;

    const [result] = await conn.query(
      'INSERT INTO produk (nama, deskripsi, harga, foto, kategori) VALUES (?, ?, ?, ?, ?)', // ✅ Tambahkan kategori ke query
      [nama, deskripsi, harga, foto, kategori]
    );
    const produkId = result.insertId;

    if (kategori === 'produk' && varian.length > 0) {
      for (let v of varian) {
        await conn.query('INSERT INTO produk_varian (produk_id, jenis_varian, nilai) VALUES (?, ?, ?)',
          [produkId, v.jenis, v.nilai]
        );
      }
    }
    await conn.commit();
    res.status(201).json({ message: "Barang berhasil ditambahkan!" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Gagal menambahkan barang" });
  } finally {
    conn.release();
  }
};


exports.getPesananMasuk = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        user_id,
        nama,
        no_hp,
        email,
        alamat,
        catatan,
        metode_pembayaran,
        total_harga,
        admin_no_hp,
        status,
        created_at
      FROM pesanan
      WHERE status = 'pending'
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error getPesananMasuk:", err.sqlMessage || err.message);
    res.status(500).json({ message: "Gagal ambil pesanan masuk" });
  }
};

exports.prosesPesanan = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE pesanan SET status = ? WHERE id = ?', ['diproses', id]);
    res.json({ message: 'Pesanan diproses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal proses pesanan' });
  }
};

exports.getRiwayat = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.total_harga, p.status, p.created_at,
             u.nama_lengkap AS pelanggan
      FROM pesanan p
      JOIN users u ON p.user_id = u.id
      WHERE p.status <> 'pending'
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil riwayat" });
  }
};


exports.getPelanggan = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nama_lengkap, email, nomor_hp, role, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal ambil data pelanggan' });
  }
};

exports.getProduk = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM produk ORDER BY created_at DESC");
    // Logika tambahan untuk varian jika diperlukan
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil produk" });
  }
};

// Fungsi untuk mengambil semua kemasan
exports.getKemasan = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kemasan ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal ambil kemasan" });
  }
};
