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

let orderId;

beforeAll(async () => {
  const cat = await prisma.category.create({ data: { name: 'Кат', slug: 'cat' } });
  const product = await prisma.product.create({
    data: { name: 'Товар', slug: 'tovar', price: 50000, categoryId: cat.id },
  });
  const order = await prisma.order.create({
    data: {
      name: 'Иван',
      phone: '+79001234567',
      total: 50000,
      items: { create: { productId: product.id, quantity: 1, price: 50000 } },
    },
  });
  orderId = order.id;
});

describe('GET /api/orders/all', () => {
  it('возвращает список заказов', async () => {
    const res = await request.get('/api/orders/all').set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Иван');
  });
});

describe('PATCH /api/orders/:id/status', () => {
  it('обновляет статус заказа', async () => {
    const res = await request.patch(`/api/orders/${orderId}/status`).set(ADMIN_HEADERS).send({ status: 'processing' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('processing');
  });
});
