import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const isAdmin = (req) => req.headers['x-admin-pass'] === ADMIN_PASS;

// Все купоны (для админки)
router.get('/all', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(coupons);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Создать купон
router.post('/', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { code, discount, type, minAmount, active, expiresAt } = req.body;
    const coupon = await prisma.coupon.create({ data: { code: code.toUpperCase(), discount: Number(discount), type, minAmount: Number(minAmount) || 0, active: active ?? true, expiresAt: expiresAt ? new Date(expiresAt) : null } });
    res.status(201).json(coupon);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Обновить купон (toggle active)
router.patch('/:id', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
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
