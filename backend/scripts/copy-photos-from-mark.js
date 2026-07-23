import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Маппинг названий папок в "Для Марка" на slug товаров и папки назначения
const PRODUCT_MAPPING = {
  'Бостон двухтумбовый': {
    slug: 'stol-pismennyj-boston-dvuhtumbovyj',
    folder: 'boston-2',
    productId: 1
  },
  'Бостон однотумбовый': {
    slug: 'stol-pismennyj-boston-odnotumbovyj',
    folder: 'boston-1',
    productId: 2
  },
  'Мишель малый': {
    slug: 'stol-pismennyj-mishel-malyj',
    folder: 'mishel-small',
    productId: 3
  },
  'Мишель большой': {
    slug: 'stol-pismennyj-mishel-bolshoj',
    folder: 'mishel-big',
    productId: 4
  },
  'Стол Рейка': {
    slug: 'stol-pismennyj-rejka',
    folder: 'rejka-desk',
    productId: 5
  },
  'Шкаф книжный': {
    slug: 'shkaf-knizhnyj',
    folder: 'bookcase',
    productId: 6
  },
  'Стеллаж Рейка': {
    slug: 'stellazh-rejka',
    folder: 'rejka-shelf',
    productId: 7
  }
};

const SOURCE_DIR = path.join(__dirname, '../../Для Марка');
const DEST_DIR = path.join(__dirname, '../../frontend-new/public/photos');

function copyPhotos() {
  console.log('Starting photo copy process...\n');

  Object.entries(PRODUCT_MAPPING).forEach(([sourceFolder, productInfo]) => {
    const sourcePath = path.join(SOURCE_DIR, sourceFolder);
    const destPath = path.join(DEST_DIR, productInfo.folder);

    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  Source folder not found: ${sourceFolder}`);
      return;
    }

    // Создаем папку назначения если её нет
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
      console.log(`📁 Created folder: ${productInfo.folder}`);
    } else {
      // Очищаем папку назначения
      fs.readdirSync(destPath).forEach(file => {
        fs.unlinkSync(path.join(destPath, file));
      });
      console.log(`🗑️  Cleaned folder: ${productInfo.folder}`);
    }

    // Читаем все файлы из папки источника
    const files = fs.readdirSync(sourcePath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file) && !/\.(txt|docx|mp4)$/i.test(file)
    );

    let mainPhoto = null;
    const otherPhotos = [];

    // Находим главное фото
    imageFiles.forEach(file => {
      if (/главн/i.test(file)) {
        mainPhoto = file;
      } else {
        otherPhotos.push(file);
      }
    });

    // Сортируем остальные фото по имени
    otherPhotos.sort();

    let photoIndex = 0;
    const photoList = [];

    // Копируем главное фото первым
    if (mainPhoto) {
      const sourcePath = path.join(SOURCE_DIR, sourceFolder, mainPhoto);
      const ext = path.extname(mainPhoto);
      const destFileName = `main${ext}`;
      const destFilePath = path.join(destPath, destFileName);
      
      fs.copyFileSync(sourcePath, destFilePath);
      photoList.push(`/photos/${productInfo.folder}/${destFileName}`);
      console.log(`  ✓ [MAIN] ${destFileName}`);
      photoIndex++;
    }

    // Копируем остальные фото
    otherPhotos.forEach(file => {
      const sourceFilePath = path.join(SOURCE_DIR, sourceFolder, file);
      const ext = path.extname(file);
      const destFileName = `photo-${photoIndex}${ext}`;
      const destFilePath = path.join(destPath, destFileName);
      
      fs.copyFileSync(sourceFilePath, destFilePath);
      photoList.push(`/photos/${productInfo.folder}/${destFileName}`);
      photoIndex++;
    });

    console.log(`✅ ${sourceFolder}: ${photoList.length} photos copied`);
    console.log(`   Product ID: ${productInfo.productId}, Slug: ${productInfo.slug}`);
    console.log(`   Photos: ${photoList.slice(0, 3).join(', ')}${photoList.length > 3 ? '...' : ''}\n`);
  });

  console.log('✨ Photo copy completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Update products.json with new photo paths');
  console.log('2. Or run database update script to update product images');
}

// Запускаем копирование
try {
  copyPhotos();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
