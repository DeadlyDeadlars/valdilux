import { Router } from 'express';
import { prisma } from '../db.js';
import { adminAuth } from '../middleware/adminAuth.js';

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

router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, slug, image } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'name and slug are required' });
    const category = await prisma.category.create({ data: { name, slug, image: image || null } });
    res.status(201).json(category);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const data = {};
    if (req.body.name !== undefined) data.name = req.body.name;
    if (req.body.slug !== undefined) data.slug = req.body.slug;
    if (req.body.image !== undefined) data.image = req.body.image;
    const category = await prisma.category.update({ where: { id: parseInt(id) }, data });
    res.json(category);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
