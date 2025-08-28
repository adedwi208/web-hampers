const sequelize = require("./db");
const User = require("./user");
const Produk = require("./produk");
const Pesanan = require("./pesanan");
const PesananItem = require("./pesananitem");
const Keranjang = require("./keranjang");

// Relasi User ↔ Pesanan
User.hasMany(Pesanan, { foreignKey: "user_id" });
Pesanan.belongsTo(User, { foreignKey: "user_id" });

// Relasi Pesanan ↔ PesananItem
Pesanan.hasMany(PesananItem, { foreignKey: "pesanan_id" });
PesananItem.belongsTo(Pesanan, { foreignKey: "pesanan_id" });

// Relasi Produk ↔ PesananItem
Produk.hasMany(PesananItem, { foreignKey: "produk_id" });
PesananItem.belongsTo(Produk, { foreignKey: "produk_id" });

// Relasi User ↔ Keranjang
User.hasMany(Keranjang, { foreignKey: "user_id" });
Keranjang.belongsTo(User, { foreignKey: "user_id" });

// Relasi Produk ↔ Keranjang
Produk.hasMany(Keranjang, { foreignKey: "produk_id" });
Keranjang.belongsTo(Produk, { foreignKey: "produk_id" });

module.exports = { sequelize, User, Produk, Pesanan, PesananItem, Keranjang };
