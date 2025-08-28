require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 8080;

// koneksi MySQL
async function connectDB() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    console.log("✅ MySQL Connected!");
    return conn;
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
  }
}

connectDB();

app.get('/', (req, res) => {
  res.send("Server sudah jalan tanpa Sequelize 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
