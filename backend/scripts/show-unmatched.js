import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

function normalize(name) {
  return name.toLowerCase().replace(/\s+/g, '');
}

async function showUnmatched() {
  const photoDir = path.join(__dirname, '../../Photo');
  const items = fs.readdirSync(photoDir, { withFileTypes: true });
  const productFolders = items.filter(item => item.isDirectory());
  
  const folders = productFolders.map(f => ({
    original: f.name,
    normalized: normalize(f.name)
  }));
  
  const products = await prisma.product.findMany();
  
  console.log('Товары в базе данных и соответствующие папки:\n');
  
  for (const product of products) {
    const normalized = normalize(product.name);
    const match = folders.find(f => f.normalized === normalized);
    
    if (match) {
      console.log(`✅ "${product.name}" → "${match.original}"`);
    } else {
      console.log(`❌ "${product.name}" → не найдена папка`);
      
      // Попробуем найти похожие папки
      const similar = folders.filter(f => 
        f.normalized.includes(normalized.substring(0, 5)) ||
        normalized.includes(f.normalized.substring(0, 5))
      );
      
      if (similar.length > 0) {
        console.log(`   Возможные варианты:`);
        similar.forEach(s => console.log(`   - ${s.original}`));
      }
    }
  }
  
  console.log('\n\nПапки без соответствующих товаров:\n');
  
  for (const folder of folders) {
    const match = products.find(p => normalize(p.name) === folder.normalized);
    if (!match) {
      console.log(`📁 ${folder.original}`);
    }
  }
  
  await prisma.$disconnect();
}

showUnmatched().catch(console.error);
