require("dotenv").config();
const mysql = require("mysql2/promise");

async function migrate() {
  console.log("Starting size_name column migration on VPS MySQL...");
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const connection = await pool.getConnection();

  try {
    const [cols] = await connection.query("SHOW COLUMNS FROM product_variants LIKE 'size_name'");
    if (cols.length === 0) {
      console.log("Adding size_name to product_variants...");
      await connection.query("ALTER TABLE product_variants ADD COLUMN size_name VARCHAR(100) NULL AFTER color_code");
      console.log("Added size_name to product_variants successfully.");
    } else {
      console.log("Column size_name already exists in product_variants.");
    }

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
