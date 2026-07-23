import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

/**
 * Пример добавления товаров через скрипт
 * 
 * Запуск: node backend/scripts/add-products-example.js
 */

const newProducts = [
  {
    name: 'Стол письменный Рейка',
    description: 'Современный письменный стол из массива дуба с характерным дизайном в виде реек. Идеально подходит для домашнего кабинета.',
    price: 38000,
    material: 'oak',
    label: 'new',
    categoryId: 1, // ID категории "Столы"
    images: [
      '/uploads/stol-reyka-1.jpg',
      '/uploads/stol-reyka-2.jpg',
      '/uploads/stol-reyka-3.jpg',
    ],
    options: [
      {
        name: 'Размер',
        values: [
          { label: '120x60 см', priceModifier: 0 },
          { label: '140x70 см', priceModifier: 5000 },
          { label: '160x80 см', priceModifier: 10000 },
        ],
      },
      {
        name: 'Покрытие',
        values: [
          { label: 'Масло', priceModifier: 0 },
          { label: 'Лак', priceModifier: 2000 },
        ],
      },
    ],
    inStock: true,
  },
  // Добавьте больше товаров здесь...
];

async function addProducts() {
  console.log('🚀 Начинаем добавление товаров...\n');

  for (const productData of newProducts) {
    try {
      // Генерируем slug из названия, если не указан
      const slug = productData.slug || slugify(productData.name, {
        lower: true,
        strict: true,
        locale: 'ru',
      });

      // Проверяем, существует ли товар с таким slug
      const existing = await prisma.product.findUnique({
        where: { slug },
      });

      if (existing) {
        console.log(`⚠️  Товар "${productData.name}" уже существует (slug: ${slug}), пропускаем...`);
        continue;
      }

      // Преобразуем массивы в JSON строки для Prisma
      const productToCreate = {
        ...productData,
        slug,
        images: JSON.stringify(productData.images || []),
        options: JSON.stringify(productData.options || []),
      };

      // Создаём товар
      const product = await prisma.product.create({
        data: productToCreate,
        include: {
          category: true,
        },
      });

      console.log(`✅ Добавлен: ${product.name}`);
      console.log(`   Категория: ${product.category.name}`);
      console.log(`   Цена: ${product.price} ₽`);
      console.log(`   URL: /catalog/${product.slug}`);
      console.log();
    } catch (error) {
      console.error(`❌ Ошибка при добавлении "${productData.name}":`, error.message);
      console.log();
    }
  }

  console.log('✨ Готово!\n');
}

// Запускаем
addProducts()
  .catch((error) => {
    console.error('Критическая ошибка:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
