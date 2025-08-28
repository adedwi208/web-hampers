const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL) {
  // ✅ Railway style (DATABASE_URL langsung)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // biar aman di Railway
      },
    },
  });
} else {
  // ✅ Local dev style (pakai DB_HOST, DB_USER, DB_PASS, DB_NAME)
  sequelize = new Sequelize(
    process.env.DB_NAME || "hampers_db",
    process.env.DB_USER || "root",
    process.env.DB_PASS || "",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "mysql",
      logging: false,
    }
  );
}

module.exports = sequelize;