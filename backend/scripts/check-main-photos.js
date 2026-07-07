import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ключевые слова для поиска главной фотографии (в нижнем регистре)
const MAIN_KEYWORDS = ['главная', 'главный', 'главное', 'основная', 'основной', 'основное'];

/**
 * Проверяет, содержит ли имя файла ключевое слово "главная/главный" и т.п.
 */
function isMainPhoto(filename) {
  const lowerFilename = filename.toLowerCase();
  return MAIN_KEYWORDS.some(keyword => lowerFilename.includes(keyword));
}

/**
 * Сканирует папку Photo и выводит отчет
 */
async function checkPhotoFolder() {
  const photoDir = path.join(__dirname, '../../Photo');
  
  if (!fs.existsSync(photoDir)) {
    console.error(`Папка Photo не найдена по пути: ${photoDir}`);
    return;
  }

  const items = fs.readdirSync(photoDir, { withFileTypes: true });
  const productFolders = items.filter(item => item.isDirectory());
  
  console.log('📁 Анализ папок в Photo:\n');

  for (const folder of productFolders) {
    const folderPath = path.join(photoDir, folder.name);
    const files = fs.readdirSync(folderPath);
    
    const photoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
    
    const mainPhotos = photoFiles.filter(file => isMainPhoto(file));
    
    if (mainPhotos.length > 0) {
      console.log(`✅ ${folder.name}`);
      mainPhotos.forEach(photo => {
        console.log(`   📸 ${photo}`);
      });
    } else {
      console.log(`❌ ${folder.name} (нет главного фото)`);
    }
    console.log('');
  }
}

// Запуск
checkPhotoFolder().catch(console.error);
