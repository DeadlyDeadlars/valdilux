import { Router } from 'express';
import { prisma } from '../db.js';
import jwt from 'jsonwebtoken';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// Все неодобренные отзывы (для админки)
router.get('/pending', adminAuth, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({ where: { approved: false }, orderBy: { createdAt: 'desc' }, include: { product: { select: { name: true } } } });
    res.json(reviews);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Все отзывы (для админки)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.review.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true } } },
      }),
      prisma.review.count(),
    ]);

    res.json({ data, total, page, limit });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Одобрить/отклонить отзыв
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const review = await prisma.review.update({ where: { id: parseInt(req.params.id) }, data: { approved: req.body.approved } });
    res.json(review);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Удалить отзыв
router.delete('/:id', adminAuth, async (req, res) => {
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
