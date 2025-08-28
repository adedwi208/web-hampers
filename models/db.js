const mysql = require('mysql2/promise');

async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });
    console.log("✅ DB Connected");
    return connection;
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

connectDB();
