const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const PesananItem = sequelize.define("PesananItem", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pesanan_id: { type: DataTypes.INTEGER, allowNull: false },
  produk_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah: { type: DataTypes.INTEGER, allowNull: false },
  harga: { type: DataTypes.DECIMAL(12,2), allowNull: false }
}, {
  tableName: "pesanan_items",
  timestamps: false
});

module.exports = PesananItem;
