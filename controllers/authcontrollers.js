const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 👉 REGISTER
exports.register = (req, res) => {
  const { nama_lengkap, nomor_hp, email, password } = req.body;

  if (!nama_lengkap || !nomor_hp || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }

  // cek email
  db.query("SELECT id FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) {
      console.error("DB error (cek email):", err);
      return res.status(500).json({ message: "Database error saat cek email" });
    }
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // hash password
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Hash error:", err);
        return res.status(500).json({ message: "Gagal hash password" });
      }

      const sql = "INSERT INTO users (nama_lengkap, nomor_hp, email, password) VALUES (?, ?, ?, ?)";
      db.query(sql, [nama_lengkap, nomor_hp, email, hash], (err2, result) => {
        if (err2) {
          console.error("DB error (insert user):", err2); // 🔴 tampilkan error asli
          return res.status(500).json({ message: "Gagal simpan user" });
        }

        console.log("User inserted:", result.insertId); // ✅ debug
        res.status(201).json({ message: "Registrasi berhasil, silakan login." });
      });
    });
  });
};


// 👉 LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi!" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error (select user)" });
    if (rows.length === 0) {
      return res.status(401).json({ message: "Email tidak terdaftar!" });
    }

    const user = rows[0];

    bcrypt.compare(password, user.password, (err2, match) => {
      if (err2) return res.status(500).json({ message: "Error saat verifikasi password" });
      if (!match) return res.status(401).json({ message: "Password salah!" });

      // buat JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "rahasia_super",
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login berhasil!",
        token,
        user: {
            id: user.id,
            nama_lengkap: user.nama_lengkap,
            nomor_hp: user.nomor_hp,
            email: user.email,
            role: user.role   // ⬅️ tambahin role
        },
        });
    });
  });
};
