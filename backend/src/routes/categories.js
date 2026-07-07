import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

router.get('/', async (_, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
    res.json(categories);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
