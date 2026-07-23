import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { setupTestDB, teardownTestDB, ADMIN_HEADERS } from './setup.js';

let request;
let prisma;

beforeAll(async () => {
  await setupTestDB();
  const mod = await import('../src/index.js');
  request = supertest(mod.app);
  prisma = mod.prisma;
});

afterAll(async () => {
  await prisma.$disconnect();
  await teardownTestDB();
});

let reviewId;
let productId;

beforeAll(async () => {
  const cat = await prisma.category.create({ data: { name: 'Кат', slug: 'cat' } });
  const product = await prisma.product.create({
    data: { name: 'Товар', slug: 'tovar', price: 50000, categoryId: cat.id },
  });
  productId = product.id;

  const review = await prisma.review.create({
    data: { productId: product.id, name: 'Клиент', rating: 5, comment: 'Отлично', approved: false },
  });
  reviewId = review.id;
});

describe('GET /api/reviews/pending', () => {
  it('возвращает неодобренные отзывы', async () => {
    const res = await request.get('/api/reviews/pending').set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(r => r.id === reviewId)).toBe(true);
  });
});

describe('GET /api/reviews/all', () => {
  it('возвращает все отзывы', async () => {
    const res = await request.get('/api/reviews/all').set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe('PATCH /api/reviews/:id', () => {
  it('одобряет отзыв', async () => {
    const res = await request.patch(`/api/reviews/${reviewId}`).set(ADMIN_HEADERS).send({ approved: true });
    expect(res.status).toBe(200);
    expect(res.body.approved).toBe(true);
  });
});

describe('DELETE /api/reviews/:id', () => {
  it('удаляет отзыв', async () => {
    const res = await request.delete(`/api/reviews/${reviewId}`).set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
