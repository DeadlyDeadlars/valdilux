import { Router } from 'express';
import { prisma } from '../db.js';
import slugify from 'slugify';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// GET все товары (для админки)
router.get('/', adminAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count(),
    ]);

    res.json({ data, total, page, limit });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET товар по ID (для админки)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ ...product, images: JSON.parse(product.images || '[]'), options: JSON.parse(product.options || '[]'), woodPrices: product.woodPrices ? JSON.parse(product.woodPrices) : undefined });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST создать товар
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, description, price, material, label, inStock, categoryId, images, options, woodPrices } = req.body;
    
    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'name, price, categoryId are required' });
    }

    // Генерируем slug если не указан
    const slug = req.body.slug || slugify(name, { lower: true, strict: true, locale: 'ru' });

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || '',
        price: parseInt(price),
        material: material || null,
        label: label || null,
        inStock: inStock !== false,
        categoryId: parseInt(categoryId),
        images: JSON.stringify(images || []),
        options: JSON.stringify(options || []),
        woodPrices: woodPrices ? JSON.stringify(woodPrices) : undefined,
      },
      include: { category: true },
    });

    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT обновить товар
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, price, material, label, inStock, categoryId, images, options, woodPrices } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseInt(price);
    if (material !== undefined) data.material = material;
    if (label !== undefined) data.label = label;
    if (inStock !== undefined) data.inStock = inStock;
    if (categoryId !== undefined) data.categoryId = parseInt(categoryId);
    if (images !== undefined) data.images = JSON.stringify(images);
    if (options !== undefined) data.options = JSON.stringify(options);
    if (woodPrices !== undefined) data.woodPrices = JSON.stringify(woodPrices);

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data,
      include: { category: true },
    });

    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE удалить товар
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
