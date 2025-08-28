const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pesanan = sequelize.define("Pesanan", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  nama: { type: DataTypes.STRING, allowNull: false },
  no_hp: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  alamat: { type: DataTypes.TEXT, allowNull: false },
  catatan: { type: DataTypes.TEXT },
  metode_pembayaran: { type: DataTypes.STRING, allowNull: false },
  total_harga: { type: DataTypes.DECIMAL(15,2), allowNull: false },
  admin_no_hp: { type: DataTypes.STRING, defaultValue: "081234567890" },
  status: { type: DataTypes.STRING, defaultValue: "pending" }
}, {
  tableName: "pesanan",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false
});

module.exports = Pesanan;
