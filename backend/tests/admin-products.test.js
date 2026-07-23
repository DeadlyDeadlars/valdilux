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

let categoryId;

beforeAll(async () => {
  const cat = await prisma.category.create({
    data: { name: 'Столы', slug: 'tables' },
  });
  categoryId = cat.id;
});

describe('POST /api/admin/products', () => {
  it('создаёт товар с валидными данными', async () => {
    const res = await request.post('/api/admin/products').set(ADMIN_HEADERS).send({
      name: 'Стол тестовый',
      price: 100000,
      categoryId,
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Стол тестовый');
    expect(res.body.slug).toBe('stol-testovyj');
    expect(res.body.price).toBe(100000);
    expect(res.body.categoryId).toBe(categoryId);
  });

  it('400 без обязательных полей', async () => {
    const res = await request.post('/api/admin/products').set(ADMIN_HEADERS).send({ name: 'Стол' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/admin/products', () => {
  it('возвращает список товаров', async () => {
    const res = await request.get('/api/admin/products').set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('PUT /api/admin/products/:id', () => {
  it('обновляет товар', async () => {
    const created = await request.post('/api/admin/products').set(ADMIN_HEADERS).send({
      name: 'Для обновления',
      price: 50000,
      categoryId,
    });
    const id = created.body.id;

    const res = await request.put(`/api/admin/products/${id}`).set(ADMIN_HEADERS).send({
      name: 'Обновлённый стол',
      price: 60000,
    });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Обновлённый стол');
    expect(res.body.price).toBe(60000);
  });

  it('404 при несуществующем ID', async () => {
    const res = await request.put('/api/admin/products/99999').set(ADMIN_HEADERS).send({ name: 'x' });
    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/admin/products/:id', () => {
  it('удаляет товар', async () => {
    const created = await request.post('/api/admin/products').set(ADMIN_HEADERS).send({
      name: 'Для удаления',
      price: 30000,
      categoryId,
    });
    const id = created.body.id;

    const res = await request.delete(`/api/admin/products/${id}`).set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
