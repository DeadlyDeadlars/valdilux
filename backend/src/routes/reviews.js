import { Router } from 'express';
import { prisma } from '../db.js';
import jwt from 'jsonwebtoken';

const router = Router();
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const isAdmin = (req) => req.headers['x-admin-pass'] === ADMIN_PASS;

// Все неодобренные отзывы (для админки)
router.get('/pending', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const reviews = await prisma.review.findMany({ where: { approved: false }, orderBy: { createdAt: 'desc' }, include: { product: { select: { name: true } } } });
    res.json(reviews);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Все отзывы (для админки)
router.get('/all', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const reviews = await prisma.review.findMany({ orderBy: { createdAt: 'desc' }, include: { product: { select: { name: true } } } });
    res.json(reviews);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Одобрить/отклонить отзыв
router.patch('/:id', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const review = await prisma.review.update({ where: { id: parseInt(req.params.id) }, data: { approved: req.body.approved } });
    res.json(review);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Удалить отзыв
router.delete('/:id', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await prisma.review.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Получить отзывы товара — GET /api/reviews?productId=1
router.get('/', async (req, res) => {
  try {
    const productId = parseInt(req.query.productId);
    if (!productId) return res.status(400).json({ error: 'productId required' });
    const reviews = await prisma.review.findMany({
      where: { productId, approved: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, rating: true, comment: true, createdAt: true },
    });
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Добавить отзыв
router.post('/', async (req, res) => {
  try {
    const { productId, name, rating, comment } = req.body;
    if (!productId || !name || !rating || !comment) {
      return res.status(400).json({ error: 'All fields required' });
    }

    let userId = null;
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch {}
    }

    const review = await prisma.review.create({
      data: { productId: parseInt(productId), userId, name, rating: parseInt(rating), comment },
    });

    res.status(201).json(review);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
