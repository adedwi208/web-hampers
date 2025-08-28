require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require('multer');
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ hubungkan ke authrouters
const authRoutes = require('./routers/authrouters');
const adminRoutes = require('./routers/adminrouters');
const produkRoutes = require('./routers/produkrouters');
const pesananRoutes = require('./routers/pesananrouters');
const keranjangRoutes = require("./routers/keranjangrouters");
const pesananRouter = require('./routers/pesananrouters');
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/produk', produkRoutes);
app.use('/api/pesanan', pesananRoutes);
app.use("/api/keranjang", keranjangRoutes);
app.use('/api', pesananRouter);

// serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pertama.html"));
});

// test API
app.get("/api/health", (req, res) => res.json({ ok: true }));


sequelize.sync({ alter: true }) // alter: true biar auto update tabel
  .then(() => console.log("✅ Database synced"))
  .catch(err => console.error("❌ DB Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
