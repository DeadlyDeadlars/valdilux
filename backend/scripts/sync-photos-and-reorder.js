import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// Ключевые слова для поиска главной фотографии (в нижнем регистре)
const MAIN_KEYWORDS = ['главная', 'главный', 'главное', 'основная', 'основной', 'основное'];

/**
 * Нормализует имя, убирая пробелы и приводя к нижнему регистру
 */
function normalize(name) {
  return name.toLowerCase().replace(/\s+/g, '');
}

/**
 * Проверяет, содержит ли имя файла ключевое слово "главная/главный" и т.п.
 */
function isMainPhoto(filename) {
  const lowerFilename = filename.toLowerCase();
  return MAIN_KEYWORDS.some(keyword => lowerFilename.includes(keyword));
}

/**
 * Копирует файл, если он не существует или отличается
 */
function copyFileIfNeeded(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    return true;
  }
  return false;
}

/**
 * Синхронизирует фото из Photo в public/photos
 */
async function syncPhotos() {
  const photoDir = path.join(__dirname, '../../Photo');
  const publicPhotosDir = path.join(__dirname, '../../frontend-new/public/photos');
  
  if (!fs.existsSync(photoDir)) {
    console.error(`Папка Photo не найдена по пути: ${photoDir}`);
    return {};
  }

  if (!fs.existsSync(publicPhotosDir)) {
    fs.mkdirSync(publicPhotosDir, { recursive: true });
  }

  const items = fs.readdirSync(photoDir, { withFileTypes: true });
  const productFolders = items.filter(item => item.isDirectory());
  
  const folderMap = {};
  let copiedCount = 0;

  console.log('📂 Синхронизация фотографий...\n');

  for (const folder of productFolders) {
    const folderPath = path.join(photoDir, folder.name);
    const files = fs.readdirSync(folderPath);
    
    const photoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    const copiedPhotos = [];
    let mainPhoto = null;

    for (const file of photoFiles) {
      const src = path.join(folderPath, file);
      const dest = path.join(publicPhotosDir, file);
      
      if (copyFileIfNeeded(src, dest)) {
        copiedCount++;
      }
      
      copiedPhotos.push(file);
      
      if (isMainPhoto(file)) {
        mainPhoto = file;
      }
    }

    if (copiedPhotos.length > 0) {
      folderMap[normalize(folder.name)] = {
        folderName: folder.name,
        photos: copiedPhotos,
        mainPhoto: mainPhoto
      };
    }
  }

  console.log(`✅ Скопировано новых фотографий: ${copiedCount}\n`);
  return folderMap;
}

/**
 * Обновляет порядок фотографий в базе данных
 */
async function updateProductPhotos(folderMap) {
  console.log('🔄 Обновление базы данных...\n');
  
  const products = await prisma.product.findMany();
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const product of products) {
    const normalizedProductName = normalize(product.name);
    
    // Ищем соответствующую папку
    const photoData = folderMap[normalizedProductName];
    
    if (!photoData) {
      console.log(`⚠️  Папка не найдена для товара: ${product.name}`);
      skippedCount++;
      continue;
    }
    
    // Парсим текущие изображения
    let currentImages = [];
    try {
      currentImages = JSON.parse(product.images);
    } catch (e) {
      currentImages = [];
    }
    
    // Формируем массив путей к фотографиям
    const newImages = photoData.photos.map(photo => `/photos/${photo}`);
    
    // Если есть главное фото, ставим его на первое место
    if (photoData.mainPhoto) {
      const mainPhotoPath = `/photos/${photoData.mainPhoto}`;
      
      // Убираем главное фото из массива, если оно там есть
      const filteredImages = newImages.filter(img => img !== mainPhotoPath);
      
      // Ставим главное фото на первое место
      const finalImages = [mainPhotoPath, ...filteredImages];
      
      // Проверяем, изменились ли фото
      const imagesChanged = JSON.stringify(currentImages) !== JSON.stringify(finalImages);
      
      if (imagesChanged) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: JSON.stringify(finalImages) }
        });
        
        console.log(`✅ ${product.name}`);
        console.log(`   📸 Главное фото: ${photoData.mainPhoto}`);
        console.log(`   📊 Всего фото: ${finalImages.length}`);
        updatedCount++;
      } else {
        console.log(`✓ ${product.name} (без изменений)`);
      }
    } else {
      // Если главного фото нет, просто обновляем список фото
      const imagesChanged = JSON.stringify(currentImages) !== JSON.stringify(newImages);
      
      if (imagesChanged && newImages.length > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: JSON.stringify(newImages) }
        });
        
        console.log(`✅ ${product.name}`);
        console.log(`   ⚠️  Главное фото не найдено`);
        console.log(`   📊 Всего фото: ${newImages.length}`);
        updatedCount++;
      } else {
        console.log(`✓ ${product.name} (без изменений)`);
      }
    }
  }
  
  console.log('\n✅ Обработка завершена!');
  console.log(`   Обновлено товаров: ${updatedCount}`);
  console.log(`   Пропущено товаров: ${skippedCount}`);
}

/**
 * Основная функция
 */
async function main() {
  try {
    const folderMap = await syncPhotos();
    await updateProductPhotos(folderMap);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Запуск
main();
