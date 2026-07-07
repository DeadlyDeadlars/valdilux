import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, phone } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email уже используется' });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, name, password: hash, phone } });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Неверный email или пароль' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Неверный email или пароль' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware для проверки токена
const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Не авторизован' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Неверный токен' });
  }
};

// Получить профиль
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, email: true, name: true, phone: true } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Обновить профиль
router.put('/me', auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await prisma.user.update({ where: { id: req.userId }, data: { name, phone }, select: { id: true, email: true, name: true, phone: true } });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Смена пароля
router.put('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Заполните все поля' });

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: 'Неверный текущий пароль' });

    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.userId }, data: { password: hash } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// История заказов
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Избранное - получить
router.get('/wishlist', auth, async (req, res) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.userId },
      include: { product: { include: { category: true } } },
    });
    res.json(items.map(i => i.product));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Избранное - добавить
router.post('/wishlist/:productId', auth, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    await prisma.wishlist.create({ data: { userId: req.userId, productId } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Избранное - удалить
router.delete('/wishlist/:productId', auth, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    await prisma.wishlist.deleteMany({ where: { userId: req.userId, productId } });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { router, auth };
