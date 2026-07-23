import { Router } from 'express';
import { prisma } from '../db.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();

// Все купоны (для админки)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.coupon.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      prisma.coupon.count(),
    ]);

    res.json({ data, total, page, limit });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Создать купон
router.post('/', adminAuth, async (req, res) => {
  try {
    const { code, discount, type, minAmount, active, expiresAt } = req.body;
    const coupon = await prisma.coupon.create({ data: { code: code.toUpperCase(), discount: Number(discount), type, minAmount: Number(minAmount) || 0, active: active ?? true, expiresAt: expiresAt ? new Date(expiresAt) : null } });
    res.status(201).json(coupon);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Обновить купон (toggle active)
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await prisma.coupon.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.json(coupon);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Проверить купон
router.post('/validate', async (req, res) => {
  try {
    const { code, amount } = req.body;
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    
    if (!coupon || !coupon.active) {
      return res.status(404).json({ error: 'Купон не найден' });
    }
    
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'Купон истёк' });
    }
    
    if (amount < coupon.minAmount) {
      return res.status(400).json({ error: `Минимальная сумма заказа ${coupon.minAmount} ₽` });
    }
    
    const discount = coupon.type === 'percent' 
      ? Math.floor(amount * coupon.discount / 100)
      : coupon.discount;
    
    res.json({ discount, type: coupon.type, value: coupon.discount });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
