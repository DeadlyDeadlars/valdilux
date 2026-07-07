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
 * Нормализует имя папки, убирая пробелы и приводя к нижнему регистру
 */
function normalizeFolder(folderName) {
  return folderName.toLowerCase().replace(/\s+/g, '');
}

/**
 * Нормализует имя товара из базы данных для сравнения с именем папки
 */
function normalizeProductName(productName) {
  return productName.toLowerCase().replace(/\s+/g, '');
}

/**
 * Проверяет, содержит ли имя файла ключевое слово "главная/главный" и т.п.
 */
function isMainPhoto(filename) {
  const lowerFilename = filename.toLowerCase();
  return MAIN_KEYWORDS.some(keyword => lowerFilename.includes(keyword));
}

/**
 * Сканирует папку Photo и возвращает информацию о товарах и их главных фото
 */
async function scanPhotoFolder() {
  const photoDir = path.join(__dirname, '../../Photo');
  
  if (!fs.existsSync(photoDir)) {
    console.error(`Папка Photo не найдена по пути: ${photoDir}`);
    return [];
  }

  const items = fs.readdirSync(photoDir, { withFileTypes: true });
  const productFolders = items.filter(item => item.isDirectory());
  
  const results = [];

  for (const folder of productFolders) {
    const folderPath = path.join(photoDir, folder.name);
    const files = fs.readdirSync(folderPath);
    
    // Находим главное фото
    const mainPhoto = files.find(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && isMainPhoto(file);
    });

    if (mainPhoto) {
      results.push({
        folderName: folder.name,
        normalizedFolderName: normalizeFolder(folder.name),
        mainPhotoFilename: mainPhoto,
        allPhotos: files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
        })
      });
    }
  }

  return results;
}

/**
 * Обновляет порядок фотографий в базе данных
 */
async function reorderPhotos() {
  console.log('🔍 Сканирование папки Photo...\n');
  
  const photoData = await scanPhotoFolder();
  
  console.log(`Найдено папок с главными фото: ${photoData.length}\n`);
  
  // Получаем все товары из базы данных
  const products = await prisma.product.findMany();
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const product of products) {
    const normalizedProductName = normalizeProductName(product.name);
    
    // Ищем соответствующую папку
    const photoFolder = photoData.find(
      item => item.normalizedFolderName === normalizedProductName
    );
    
    if (!photoFolder) {
      console.log(`⚠️  Папка не найдена для товара: ${product.name}`);
      skippedCount++;
      continue;
    }
    
    // Парсим текущие изображения
    let currentImages = [];
    try {
      currentImages = JSON.parse(product.images);
    } catch (e) {
      console.log(`⚠️  Ошибка парсинга images для товара: ${product.name}`);
      skippedCount++;
      continue;
    }
    
    if (!Array.isArray(currentImages) || currentImages.length === 0) {
      console.log(`⚠️  Нет изображений для товара: ${product.name}`);
      skippedCount++;
      continue;
    }
    
    // Формируем путь к главному фото
    const mainPhotoPath = `/photos/${photoFolder.mainPhotoFilename}`;
    
    // Проверяем, не стоит ли главное фото уже на первом месте
    if (currentImages[0] === mainPhotoPath) {
      console.log(`✓ Главное фото уже на первом месте: ${product.name}`);
      continue;
    }
    
    // Находим главное фото в массиве
    const mainPhotoIndex = currentImages.findIndex(img => {
      const filename = path.basename(img);
      return isMainPhoto(filename);
    });
    
    if (mainPhotoIndex === -1) {
      // Главное фото не найдено в текущем массиве, добавляем его
      console.log(`📸 Добавляем главное фото для товара: ${product.name}`);
      currentImages.unshift(mainPhotoPath);
    } else {
      // Перемещаем главное фото на первое место
      console.log(`🔄 Переставляем главное фото на первое место: ${product.name}`);
      const [mainPhoto] = currentImages.splice(mainPhotoIndex, 1);
      currentImages.unshift(mainPhoto);
    }
    
    // Обновляем в базе данных
    await prisma.product.update({
      where: { id: product.id },
      data: { images: JSON.stringify(currentImages) }
    });
    
    updatedCount++;
  }
  
  console.log('\n✅ Обработка завершена!');
  console.log(`   Обновлено товаров: ${updatedCount}`);
  console.log(`   Пропущено товаров: ${skippedCount}`);
}

// Запуск скрипта
reorderPhotos()
  .catch(error => {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
