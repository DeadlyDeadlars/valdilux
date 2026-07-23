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

describe('POST /api/categories', () => {
  it('создаёт категорию', async () => {
    const res = await request.post('/api/categories').set(ADMIN_HEADERS).send({
      name: 'Столы', slug: 'tables',
    });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Столы');
    expect(res.body.slug).toBe('tables');
  });

  it('400 без обязательных полей', async () => {
    const res = await request.post('/api/categories').set(ADMIN_HEADERS).send({ name: 'x' });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/categories/:id', () => {
  it('обновляет категорию', async () => {
    const created = await request.post('/api/categories').set(ADMIN_HEADERS).send({
      name: 'Старое', slug: 'old',
    });
    const id = created.body.id;

    const res = await request.put(`/api/categories/${id}`).set(ADMIN_HEADERS).send({ name: 'Новое' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Новое');
  });
});

describe('DELETE /api/categories/:id', () => {
  it('удаляет категорию', async () => {
    const created = await request.post('/api/categories').set(ADMIN_HEADERS).send({
      name: 'На удаление', slug: 'delete-me',
    });
    const id = created.body.id;

    const res = await request.delete(`/api/categories/${id}`).set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
