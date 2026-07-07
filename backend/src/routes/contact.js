import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: 'name and message are required' });
    const msg = await prisma.contactMessage.create({ data: { name, phone, email, message } });
    res.status(201).json(msg);
  } catch (e) {
    res.status(500).json({ error: e.message });
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
    res.status(500).json({ error: e.message });
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
    res.status(500).json({ error: e.message });
  }
});

export default router;
