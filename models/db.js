const mysql = require('mysql2/promise');
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Koneksi database berhasil!");
    connection.release(); // Lepaskan koneksi kembali ke pool
  } catch (err) {
    console.error("❌ Koneksi database gagal:", err);
    // Berhenti jika koneksi gagal untuk mencegah error lebih lanjut
    process.exit(1); 
  }
}

testConnection();

module.exports = pool;