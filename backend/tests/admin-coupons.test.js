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

describe('POST /api/coupons', () => {
  it('создаёт купон', async () => {
    const res = await request.post('/api/coupons').set(ADMIN_HEADERS).send({
      code: 'SALE10',
      discount: 10,
      type: 'percent',
    });
    expect(res.status).toBe(201);
    expect(res.body.code).toBe('SALE10');
    expect(res.body.discount).toBe(10);
  });
});

describe('GET /api/coupons/all', () => {
  it('возвращает список купонов', async () => {
    const res = await request.get('/api/coupons/all').set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('PATCH /api/coupons/:id', () => {
  it('обновляет купон', async () => {
    const created = await request.post('/api/coupons').set(ADMIN_HEADERS).send({
      code: 'TEST', discount: 5, type: 'fixed',
    });

    const res = await request.patch(`/api/coupons/${created.body.id}`).set(ADMIN_HEADERS).send({
      active: false,
    });
    expect(res.status).toBe(200);
    expect(res.body.active).toBe(false);
  });
});

describe('POST /api/coupons/validate', () => {
  it('проверяет купон', async () => {
    await request.post('/api/coupons').set(ADMIN_HEADERS).send({
      code: 'VALID', discount: 20, type: 'percent',
    });

    const res = await request.post('/api/coupons/validate').send({
      code: 'VALID', amount: 1000,
    });
    expect(res.status).toBe(200);
    expect(res.body.discount).toBe(200);
  });

  it('404 для несуществующего купона', async () => {
    const res = await request.post('/api/coupons/validate').send({
      code: 'NONEXISTENT', amount: 1000,
    });
    expect(res.status).toBe(404);
  });
});
