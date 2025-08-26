const mysql = require("mysql2");
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hampers_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
pool.getConnection((err, conn) => {
  if (err) {
    console.error("Gagal connect DB:", err.code, err.message);
    process.exit(1);
  }
  console.log("DB connected ✅");
  conn.release();
});
module.exports = pool;
