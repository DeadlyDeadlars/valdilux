import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { setupTestDB, teardownTestDB } from './setup.js';

let request;

beforeAll(async () => {
  await setupTestDB();
  const { app } = await import('../src/index.js');
  request = supertest(app);
});

afterAll(async () => {
  await teardownTestDB();
});

const protectedRoutes = [
  ['GET', '/api/admin/products'],
  ['GET', '/api/admin/products/1'],
  ['POST', '/api/admin/products'],
  ['PUT', '/api/admin/products/1'],
  ['DELETE', '/api/admin/products/1'],
  ['GET', '/api/orders/all'],
  ['PATCH', '/api/orders/1/status'],
  ['GET', '/api/reviews/pending'],
  ['GET', '/api/reviews/all'],
  ['POST', '/api/coupons'],
  ['GET', '/api/coupons/all'],
  ['POST', '/api/posts'],
  ['GET', '/api/posts/all'],
  ['POST', '/api/categories'],
  ['PUT', '/api/categories/1'],
  ['DELETE', '/api/categories/1'],
  ['GET', '/api/contact/all'],
  ['DELETE', '/api/contact/1'],
  ['GET', '/api/users'],
  ['GET', '/api/users/1'],
  ['DELETE', '/api/users/1'],
];

describe('Admin auth middleware', () => {
  it.each(protectedRoutes)('%s %s → 401 без x-admin-pass', async (method, url) => {
    const res = await request[method.toLowerCase()](url);
    expect(res.status).toBe(401);
  });

  it.each(protectedRoutes)('%s %s → 401 с неверным паролем', async (method, url) => {
    const res = await request[method.toLowerCase()](url).set('x-admin-pass', 'wrong');
    expect(res.status).toBe(401);
  });
});
