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

export default router;
