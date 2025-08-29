const db = require("../models/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// authcontrollers.js
// Pastikan Anda sudah mengimpor mysql2/promise di file db.js
// ...

// 👉 REGISTER (DIPERBAIKI)
exports.register = async (req, res) => {
  const { nama_lengkap, nomor_hp, email, password } = req.body;

  if (!nama_lengkap || !nomor_hp || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }

  try {
    // Cek apakah email sudah terdaftar
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // Hash password secara asinkron
    const hash = await bcrypt.hash(password, 10);

    // Simpan pengguna ke database
    const sql = "INSERT INTO users (nama_lengkap, nomor_hp, email, password) VALUES (?, ?, ?, ?)";
    const [result] = await db.query(sql, [nama_lengkap, nomor_hp, email, hash]);

    console.log("User inserted:", result.insertId);
    res.status(201).json({ message: "Registrasi berhasil, silakan login." });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Gagal melakukan registrasi" });
  }
};


// 👉 LOGIN
// 👉 LOGIN
// authcontrollers.js
// ... import db, bcrypt, jwt
// ... fungsi register (biarkan dulu jika masih berfungsi)

// 👉 LOGIN (DIPERBAIKI)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi!" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email tidak terdaftar!" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Password salah!" });
    }

    // buat JWT token dengan role
    const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || "rahasia_super",
  { expiresIn: "5d" }
);


    res.json({
      message: "Login berhasil!",
      token,
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        nomor_hp: user.nomor_hp,
        email: user.email,
        role: user.role
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

