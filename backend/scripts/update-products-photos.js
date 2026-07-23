import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_JSON_PATH = path.join(__dirname, '../../frontend-new/public/products.json');
const PHOTOS_DIR = path.join(__dirname, '../../frontend-new/public/photos');

// Маппинг ID товаров на папки с фото
const PRODUCT_FOLDERS = {
  1: 'boston-2',
  2: 'boston-1',
  3: 'mishel-small',
  4: 'mishel-big',
  5: 'rejka-desk',
  6: 'bookcase',
  7: 'rejka-shelf'
};

function getPhotosForProduct(folder) {
  const folderPath = path.join(PHOTOS_DIR, folder);
  
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Folder not found: ${folder}`);
    return [];
  }

  const files = fs.readdirSync(folderPath);
  const photos = files
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort((a, b) => {
      // Главное фото всегда первое
      if (a.startsWith('main')) return -1;
      if (b.startsWith('main')) return 1;
      return a.localeCompare(b);
    })
    .map(file => `/photos/${folder}/${file}`);

  return photos;
}

function updateProductsJson() {
  console.log('📖 Reading products.json...\n');

  // Читаем текущий products.json
  const productsData = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));

  console.log(`Found ${productsData.length} products\n`);

  // Обновляем фотографии для каждого товара
  productsData.forEach(product => {
    const folder = PRODUCT_FOLDERS[product.id];
    
    if (!folder) {
      console.log(`⚠️  No folder mapping for product ID: ${product.id} (${product.name})`);
      return;
    }

    const oldPhotosCount = product.images ? product.images.length : 0;
    const newPhotos = getPhotosForProduct(folder);

    product.images = newPhotos;

    console.log(`✅ Product ID ${product.id}: "${product.name}"`);
    console.log(`   Photos: ${oldPhotosCount} → ${newPhotos.length}`);
    if (newPhotos.length > 0) {
      console.log(`   Main photo: ${newPhotos[0]}`);
    }
    console.log('');
  });

  // Сохраняем обновленный products.json
  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(productsData, null, 2), 'utf8');

  console.log('✨ products.json updated successfully!');
  console.log(`📄 File: ${PRODUCTS_JSON_PATH}`);
}

// Запускаем обновление
try {
  updateProductsJson();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
