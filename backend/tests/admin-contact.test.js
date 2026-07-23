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

let messageId;

beforeAll(async () => {
  const msg = await prisma.contactMessage.create({
    data: { name: 'Иван', phone: '+79001234567', message: 'Нужен стол' },
  });
  messageId = msg.id;
});

describe('GET /api/contact/all', () => {
  it('возвращает заявки', async () => {
    const res = await request.get('/api/contact/all').set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toBe('Иван');
  });
});

describe('DELETE /api/contact/:id', () => {
  it('удаляет заявку', async () => {
    const res = await request.delete(`/api/contact/${messageId}`).set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
