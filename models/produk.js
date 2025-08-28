const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Produk = sequelize.define("Produk", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nama: { type: DataTypes.STRING, allowNull: false },
  deskripsi: { type: DataTypes.TEXT },
  harga: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  foto: { type: DataTypes.STRING },
  kategori: { type: DataTypes.ENUM("produk", "kemasan"), allowNull: false }
}, {
  tableName: "produk",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

module.exports = Produk;
