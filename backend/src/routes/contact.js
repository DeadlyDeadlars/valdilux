import { Router } from 'express';
import { prisma } from '../db.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: 'name and message are required' });
    const msg = await prisma.contactMessage.create({ data: { name, phone, email, message } });
    res.status(201).json(msg);
  } catch (e) {
    console.error('Contact create error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обратный звонок
router.post('/callback', async (req, res) => {
  try {
    const { name, phone, time } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'name and phone are required' });
    const msg = await prisma.contactMessage.create({
      data: { name, phone, message: time ? `Обратный звонок. Удобное время: ${time}` : 'Обратный звонок' },
    });
    res.status(201).json(msg);
  } catch (e) {
    console.error('Contact callback error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Вопрос по товару
router.post('/question', async (req, res) => {
  try {
    const { name, phone, question, product } = req.body;
    if (!name || !phone || !question) return res.status(400).json({ error: 'name, phone and question are required' });
    const msg = await prisma.contactMessage.create({
      data: { name, phone, message: `Вопрос по товару "${product}": ${question}` },
    });
    res.status(201).json(msg);
  } catch (e) {
    console.error('Contact question error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Админ: все заявки
router.get('/all', adminAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.contactMessage.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.contactMessage.count(),
    ]);

    res.json({ data, total, page, limit });
  } catch (e) {
    console.error('Contact list error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Админ: удалить заявку
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) {
    console.error('Contact delete error:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
