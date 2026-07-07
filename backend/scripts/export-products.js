import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function exportProducts() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { id: 'asc' }
    });

    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      material: p.material,
      label: p.label,
      inStock: p.inStock,
      images: JSON.parse(p.images || '[]'),
      options: JSON.parse(p.options || '[]'),
      categoryId: p.categoryId,
      category: p.category ? {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug
      } : null,
      createdAt: p.createdAt.toISOString()
    }));

    const outputPath = path.join(__dirname, '../../frontend-new/public/products.json');
    fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2));
    
    console.log(`✅ Экспортировано ${formatted.length} товаров в products.json`);
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportProducts();
