import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const isAdmin = (req) => req.headers['x-admin-pass'] === ADMIN_PASS;

// Все посты (для админки)
router.get('/all', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(posts);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Создать пост
router.post('/', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { title, slug, content, type, image, published } = req.body;
    const post = await prisma.post.create({ data: { title, slug, content, type, image, published: published ?? false } });
    res.status(201).json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Обновить пост
router.put('/:id', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { title, slug, content, type, image, published } = req.body;
    const post = await prisma.post.update({ where: { id: parseInt(req.params.id) }, data: { title, slug, content, type, image, published } });
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Удалить пост
router.delete('/:id', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await prisma.post.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Получить список постов
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const posts = await prisma.post.findMany({
      where: { published: true, ...(type && { type: String(type) }) },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, content: true, type: true, image: true, createdAt: true },
    });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Получить пост по slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { slug: req.params.slug, published: true } });
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
