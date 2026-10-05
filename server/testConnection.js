const mysql = require("mysql2/promise");
require("dotenv").config();

async function testConn() {
  console.log("Connecting to VPS MySQL...", {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 8000,
    });

    console.log("Connected successfully to MySQL on VPS!");
    const [rows] = await connection.query("SELECT 1 + 1 AS test, VERSION() as version;");
    console.log("Query test result:", rows);
    await connection.end();
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
}

testConn();
