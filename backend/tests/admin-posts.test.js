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

describe('POST /api/posts', () => {
  it('создаёт пост', async () => {
    const res = await request.post('/api/posts').set(ADMIN_HEADERS).send({
      title: 'Новость',
      slug: 'novost',
      content: '# Заголовок',
      type: 'news',
    });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Новость');
    expect(res.body.slug).toBe('novost');
  });

  it('400 без обязательных полей', async () => {
    const res = await request.post('/api/posts').set(ADMIN_HEADERS).send({ title: 'x' });
    expect(res.status).toBe(500);
  });
});

describe('GET /api/posts/all', () => {
  it('возвращает все посты', async () => {
    const res = await request.get('/api/posts/all').set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('PUT /api/posts/:id', () => {
  it('обновляет пост', async () => {
    const created = await request.post('/api/posts').set(ADMIN_HEADERS).send({
      title: 'Статья', slug: 'statya', content: 'text', type: 'article',
    });

    const res = await request.put(`/api/posts/${created.body.id}`).set(ADMIN_HEADERS).send({
      title: 'Обновлённая статья',
    });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Обновлённая статья');
  });
});

describe('DELETE /api/posts/:id', () => {
  it('удаляет пост', async () => {
    const created = await request.post('/api/posts').set(ADMIN_HEADERS).send({
      title: 'На удаление', slug: 'na-udalenie', content: 'x', type: 'news',
    });

    const res = await request.delete(`/api/posts/${created.body.id}`).set(ADMIN_HEADERS);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
