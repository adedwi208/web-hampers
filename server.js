require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
const authRoutes = require("./routers/authrouters");
const adminRoutes = require("./routers/adminrouters");
const produkRoutes = require("./routers/produkrouters");
const pesananRoutes = require("./routers/pesananrouters");
const keranjangRoutes = require("./routers/keranjangrouters");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/produk", produkRoutes);
app.use("/api/pesanan", pesananRoutes);
app.use("/api/keranjang", keranjangRoutes);

// serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pertama.html"));
});

// health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ✅ sync DB dulu baru jalanin server
sequelize
  .sync({ alter: true }) // alter = auto revise tabel tanpa hapus data
  .then(() => {
    console.log("✅ Database synced");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Error:", err);
    process.exit(1); // stop kalau gagal konek DB
  });