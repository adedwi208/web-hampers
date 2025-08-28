const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  try {
    // Koneksi root untuk inisialisasi
    const rootConn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_ROOT_USER,
      password: process.env.DB_ROOT_PASSWORD,
      port: process.env.DB_PORT
    });

    // Buat database jika belum ada
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

    // Buat user aplikasi jika belum ada
    await rootConn.query(
      `CREATE USER IF NOT EXISTS '${process.env.DB_USER}'@'%' IDENTIFIED BY '${process.env.DB_PASSWORD}'`
    );

    // Berikan hak akses
    await rootConn.query(
      `GRANT ALL PRIVILEGES ON ${process.env.DB_NAME}.* TO '${process.env.DB_USER}'@'%'`
    );

    await rootConn.query(`FLUSH PRIVILEGES`);

    console.log('✅ Database dan user berhasil dibuat!');

    await rootConn.end();
  } catch (err) {
    console.error('❌ Gagal inisialisasi database:', err);
  }
}

initDatabase();
