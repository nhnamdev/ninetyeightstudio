require("dotenv").config();
const pool = require("../config/db");
const kiotvietService = require("../services/kiotvietService");
const { extractVariantAttributes } = require("../services/syncService");

async function run() {
  console.log("Starting update of color_name & size_name for existing variants from KiotViet...");

  const { total, data: kvItems } = await kiotvietService.getAllProducts();
  console.log(`Fetched ${kvItems.length} products from KiotViet.`);

  const connection = await pool.getConnection();
  try {
    let updatedCount = 0;
    for (const item of kvItems) {
      const { colorName, sizeName } = extractVariantAttributes(item, item.name);
      const kvId = item.id;
      const kvCode = item.code;

      const [res] = await connection.query(
        `UPDATE product_variants 
         SET color_name = ?, size_name = ? 
         WHERE kiotviet_id = ? OR kiotviet_code = ? OR sku = ?`,
        [colorName, sizeName, kvId, kvCode, kvCode]
      );

      if (res.affectedRows > 0) {
        updatedCount += res.affectedRows;
      }
    }

    console.log(`Updated attributes for ${updatedCount} variant rows in database!`);
  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

run();
