import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Categories
  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: 'tables' }, update: {}, create: { name: 'Столы', slug: 'tables' } }),
    prisma.category.upsert({ where: { slug: 'chairs' }, update: {}, create: { name: 'Стулья', slug: 'chairs' } }),
    prisma.category.upsert({ where: { slug: 'cabinets' }, update: {}, create: { name: 'Шкафы', slug: 'cabinets' } }),
    prisma.category.upsert({ where: { slug: 'sofas' }, update: {}, create: { name: 'Диваны', slug: 'sofas' } }),
  ]);

  const [tables, chairs, cabinets, sofas] = cats;

  const products = [
    { name: 'Обеденный стол Monarch', slug: 'monarch-table', description: 'Роскошный обеденный стол из массива дуба. Классический дизайн с современными элементами.', price: 185000, material: 'Дуб', label: 'new', categoryId: tables.id },
    { name: 'Стол письменный Noble', slug: 'noble-desk', description: 'Письменный стол из массива ореха. Строгий и элегантный дизайн для домашнего кабинета.', price: 165000, material: 'Орех', label: null, categoryId: tables.id },
    { name: 'Стол обеденный Prestige', slug: 'prestige-table', description: 'Обеденный стол из массива ясеня с раздвижным механизмом.', price: 210000, material: 'Ясень', label: 'hit', categoryId: tables.id },
    { name: 'Кресло Executive', slug: 'executive-chair', description: 'Кресло руководителя из натуральной кожи на основании из ореха.', price: 95000, material: 'Орех', label: 'new', categoryId: chairs.id },
    { name: 'Стул Windsor', slug: 'windsor-chair', description: 'Классический стул Windsor из массива дуба. Ручная работа.', price: 45000, material: 'Дуб', label: null, categoryId: chairs.id },
    { name: 'Стул Baron', slug: 'baron-chair', description: 'Мягкий стул с обивкой из натуральной кожи и основанием из ясеня.', price: 68000, material: 'Ясень', label: 'hit', categoryId: chairs.id },
    { name: 'Шкаф Heritage', slug: 'heritage-cabinet', description: 'Вместительный шкаф из массива ясеня с зеркальными дверями.', price: 245000, material: 'Ясень', label: null, categoryId: cabinets.id },
    { name: 'Шкаф-купе Grand', slug: 'grand-wardrobe', description: 'Шкаф-купе из массива дуба с системой хранения.', price: 320000, material: 'Дуб', label: 'hit', categoryId: cabinets.id },
    { name: 'Диван Prestige', slug: 'prestige-sofa', description: 'Диван из итальянской кожи на основании из массива ореха.', price: 320000, material: 'Орех', label: 'hit', categoryId: sofas.id },
    { name: 'Диван Classic', slug: 'classic-sofa', description: 'Классический диван с обивкой из натуральной кожи.', price: 280000, material: 'Дуб', label: 'new', categoryId: sofas.id },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, images: '[]' },
    });
  }

  console.log('Seed done');
}

main().catch(console.error).finally(() => prisma.$disconnect());
