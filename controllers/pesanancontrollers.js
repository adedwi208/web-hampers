// controllers/pesanancontrollers.js
const db = require('../models/db');

exports.checkout = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    const { full_name, email, phone, address, payment_method, order_id, total_amount, catatan_ukuran } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "User ID tidak ditemukan" });

    // 1) insert ke tabel pesanan (sesuai struktur DB: pesanan)
    const [result] = await db.query(
      `INSERT INTO pesanan
        (user_id, nama, no_hp, email, alamat, metode_pembayaran, total_harga, admin_no_hp, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, full_name, phone, email, address, payment_method, total_amount, '081234567890']
    );

    const idPesanan = result.insertId;
    const adminNo = '081234567890';
    const resi = idPesanan; // bisa juga bikin format lain, contoh: 'INV' + idPesanan

    // 2) ambil item dari tabel cart jika ada (skema lama)
    let cartItems = [];
    try {
      const [rows] = await db.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
      if (rows && rows.length > 0) {
        // asumsikan cart: {id, user_id, product_id, size, quantity, total_price}
        cartItems = rows.map(r => ({
          product_id: r.product_id,
          size: r.size || null,
          quantity: r.quantity,
          price: parseFloat(r.total_price) / (r.quantity || 1) || 0, // harga satuan (jika tersimpan total_price)
          total_price: r.total_price
        }));
      }
    } catch (e) {
      // jika tabel cart tidak ada atau error, lanjut ke keranjang
      console.log("Ambil cart error (ignored):", e.message);
    }

    // 3) ambil item dari tabel keranjang (skema alternatif yang ada di dump)
    try {
      const [rowsKeranjang] = await db.query('SELECT * FROM keranjang WHERE user_id = ?', [userId]);
      if (rowsKeranjang && rowsKeranjang.length > 0) {
        for (const k of rowsKeranjang) {
          // k: {id, user_id, item_id, kategori, jumlah}
          if (k.kategori === 'produk') {
            const [pRows] = await db.query('SELECT id, nama, harga FROM produk WHERE id = ?', [k.item_id]);
            if (pRows.length > 0) {
              const prod = pRows[0];
              cartItems.push({
                product_id: prod.id,
                size: null, // size disimpan di catatan_ukuran (global) atau di produk_varian jika ada
                quantity: k.jumlah,
                price: parseFloat(prod.harga),
                total_price: parseFloat(prod.harga) * k.jumlah
              });
            }
          } else if (k.kategori === 'kemasan') {
            // kemasan ada di tabel kemasan
            const [km] = await db.query('SELECT id, nama, harga FROM kemasan WHERE id = ?', [k.item_id]);
            if (km.length > 0) {
              const kmObj = km[0];
              cartItems.push({
                product_id: kmObj.id,
                size: null,
                quantity: k.jumlah,
                price: parseFloat(kmObj.harga),
                total_price: parseFloat(kmObj.harga) * k.jumlah
              });
            }
          }
        }
      }
    } catch (e) {
      console.log("Ambil keranjang error (ignored):", e.message);
    }

    // 4) Masukkan setiap item ke pesanan_item
    for (const item of cartItems) {
      await db.query(
        'INSERT INTO pesanan_item (pesanan_id, product_id, size, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [idPesanan, item.product_id, item.size || null, item.quantity, item.price]
      );
    }

    // 5) Hapus data keranjang (kedua tabel bila ada)
    try { await db.query('DELETE FROM cart WHERE user_id = ?', [userId]); } catch(e){/* ignore if not exist */ }
    try { await db.query('DELETE FROM keranjang WHERE user_id = ?', [userId]); } catch(e){/* ignore if not exist */ }

    // 6) Insert catatan ukuran ke tabel pesanan? (bila ingin disimpan)
    // Kalau mau menyimpan catatan global, bisa tambahkan kolom 'catatan' di tabel pesanan. 
    // Untuk sekarang kita kirim kembali ke frontend di response (tidak mengubah struktur DB).
    res.json({
      message: "Checkout berhasil!",
      resi,
      admin_no: adminNo,
      metode_pembayaran: payment_method || payment_method,
      catatan_ukuran: catatan_ukuran || null
    });

  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Gagal checkout", error: err.message });
  }
};
