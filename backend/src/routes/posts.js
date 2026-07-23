import { Router } from 'express';
import { prisma } from '../db.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// Все посты (для админки)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.post.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.post.count(),
    ]);

    res.json({ data, total, page, limit });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Создать пост
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, slug, content, type, image, published } = req.body;
    const post = await prisma.post.create({ data: { title, slug, content, type, image, published: published ?? false } });
    res.status(201).json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Обновить пост
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, slug, content, type, image, published } = req.body;
    const post = await prisma.post.update({ where: { id: parseInt(req.params.id) }, data: { title, slug, content, type, image, published } });
    res.json(post);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Удалить пост
router.delete('/:id', adminAuth, async (req, res) => {
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
