import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const isAdmin = (req) => req.headers['x-admin-pass'] === ADMIN_PASS;

// Создать товар
router.post('/', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { name, slug, description, price, material, label, inStock, images, options, categoryId } = req.body;
    const product = await prisma.product.create({
      data: { name, slug, description, price: Number(price), material, label, inStock: inStock ?? true, images: JSON.stringify(images || []), options: JSON.stringify(options || []), categoryId: Number(categoryId) },
    });
    res.status(201).json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Обновить товар
router.put('/:id', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { name, slug, description, price, material, label, inStock, images, options, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { name, slug, description, price: Number(price), material, label, inStock, images: JSON.stringify(images || []), options: JSON.stringify(options || []), categoryId: Number(categoryId) },
    });
    res.json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Удалить товар
router.delete('/:id', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/products?category=tables&material=Дуб&minPrice=0&maxPrice=999999&label=hit&sort=popular&page=1&limit=12
router.get('/', async (req, res) => {
  try {
    const { category, material, minPrice, maxPrice, label, sort, page = 1, limit = 12 } = req.query;

    const where = {};
    if (category) where.category = { slug: category };
    if (material) where.material = material;
    if (label) where.label = label;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const orderBy =
      sort === 'price_asc' ? { price: 'asc' }
      : sort === 'price_desc' ? { price: 'desc' }
      : sort === 'new' ? { createdAt: 'desc' }
      : { id: 'asc' };

    const [total, data] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        include: { category: true },
      }),
    ]);

    res.json({ data: data.map(parseImages), total, page: Number(page), limit: Number(limit) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(parseImages(product));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function parseImages(p) {
  return { ...p, images: JSON.parse(p.images || '[]') };
}

export default router;
