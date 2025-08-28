const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Keranjang = sequelize.define("Keranjang", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  produk_id: { type: DataTypes.INTEGER, allowNull: false },
  jumlah: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
}, {
  tableName: "keranjang",
  timestamps: false
});

module.exports = Keranjang;
