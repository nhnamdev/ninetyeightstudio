import fs from 'fs';
import path from 'path';
import pool from '../server/config/db.js';

async function updateDbWithR2() {
  console.log('--- ĐANG BẮT ĐẦU CẬP NHẬT CSDL MYSQL VPS VỚI URL R2 ---');
  const mappingPath = path.resolve('docs/r2-mapping.json');
  if (!fs.existsSync(mappingPath)) {
    console.error('Không tìm thấy file docs/r2-mapping.json!');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  console.log(`Đã nạp ${Object.keys(mapping).length} URL ánh xạ từ R2.`);

  // 1. Cập nhật bảng products
  const [products] = await pool.query('SELECT id, cover_image, hover_image, gallery_images FROM products');
  let updatedProductsCount = 0;

  for (const prod of products) {
    let newCover = mapping[prod.cover_image] || prod.cover_image;
    let newHover = mapping[prod.hover_image] || prod.hover_image;

    let gallery = [];
    if (typeof prod.gallery_images === 'string') {
      try {
        gallery = JSON.parse(prod.gallery_images);
      } catch (e) {
        gallery = [];
      }
    } else if (Array.isArray(prod.gallery_images)) {
      gallery = prod.gallery_images;
    }

    const newGallery = gallery.map(img => mapping[img] || img);

    await pool.query(
      'UPDATE products SET cover_image = ?, hover_image = ?, gallery_images = ? WHERE id = ?',
      [newCover, newHover, JSON.stringify(newGallery), prod.id]
    );
    updatedProductsCount++;
  }
  console.log(`✓ Đã cập nhật ${updatedProductsCount} sản phẩm trong bảng products.`);

  // 2. Cập nhật bảng product_variants
  const [variants] = await pool.query('SELECT id, image FROM product_variants');
  let updatedVariantsCount = 0;

  for (const v of variants) {
    let newImg = mapping[v.image] || v.image;
    if (newImg !== v.image) {
      await pool.query('UPDATE product_variants SET image = ? WHERE id = ?', [newImg, v.id]);
      updatedVariantsCount++;
    }
  }
  console.log(`✓ Đã cập nhật ${updatedVariantsCount} biến thể trong bảng product_variants.`);

  // 3. Kiểm tra mẫu 1 sản phẩm
  const [sample] = await pool.query('SELECT id, name, cover_image, hover_image FROM products LIMIT 1');
  console.log('Sản phẩm mẫu sau khi cập nhật:', sample[0]);

  console.log('--- HOÀN TẤT CẬP NHẬT CSDL THÀNH CÔNG! ---');
  process.exit(0);
}

updateDbWithR2().catch(err => {
  console.error('Lỗi khi cập nhật CSDL:', err);
  process.exit(1);
});
