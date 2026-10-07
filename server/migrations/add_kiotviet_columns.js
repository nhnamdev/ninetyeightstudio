require("dotenv").config();
const mysql = require("mysql2/promise");

async function migrate() {
  console.log("Starting KiotViet columns migration on VPS MySQL...");
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const connection = await pool.getConnection();

  try {
    const helper = async (table, column, definition) => {
      const [cols] = await connection.query(`SHOW COLUMNS FROM ${table} LIKE '${column}'`);
      if (cols.length === 0) {
        console.log(`Adding ${column} to ${table}...`);
        await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        console.log(`Added ${column} to ${table} successfully.`);
      } else {
        console.log(`Column ${column} already exists in ${table}.`);
      }
    };

    // 1. Categories
    await helper("categories", "kiotviet_id", "BIGINT NULL UNIQUE");

    // 2. Products
    await helper("products", "kiotviet_id", "BIGINT NULL");
    await helper("products", "kiotviet_code", "VARCHAR(100) NULL");

    // 3. Product Variants
    await helper("product_variants", "kiotviet_id", "BIGINT NULL");
    await helper("product_variants", "kiotviet_code", "VARCHAR(100) NULL");

    // 4. Orders
    await helper("orders", "kiotviet_order_id", "BIGINT NULL");
    await helper("orders", "kiotviet_order_code", "VARCHAR(100) NULL");

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

migrate();
