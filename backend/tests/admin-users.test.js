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

let userId;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: { email: 'test@test.com', name: 'Тест', password: 'hash' },
  });
  userId = user.id;
});

describe('GET /api/users', () => {
  it('возвращает список пользователей', async () => {
    const res = await request.get('/api/users').set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].email).toBe('test@test.com');
    expect(res.body[0].password).toBeUndefined();
  });
});

describe('GET /api/users/:id', () => {
  it('возвращает пользователя с заказами', async () => {
    const res = await request.get(`/api/users/${userId}`).set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('test@test.com');
    expect(Array.isArray(res.body.orders)).toBe(true);
  });

  it('404 для несуществующего ID', async () => {
    const res = await request.get('/api/users/99999').set(ADMIN_HEADERS);
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/users/:id', () => {
  it('удаляет пользователя', async () => {
    const res = await request.delete(`/api/users/${userId}`).set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
