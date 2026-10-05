const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "36.50.27.243",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "98studio_user",
  password: process.env.DB_PASSWORD || "98studio_pass",
  database: process.env.DB_NAME || "98studio_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
