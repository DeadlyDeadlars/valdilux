import { Router } from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { prisma } from '../db.js';

const router = Router();

const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const isAdmin = (req) => req.headers['x-admin-pass'] === ADMIN_PASS;

// Все заказы (для админки)
router.get('/all', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Обновить статус заказа (для админки)
router.patch('/:id/status', async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status: req.body.status },
    });
    res.json(order);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.yandex.ru',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOrderEmails(order, productMap) {
  if (!process.env.SMTP_USER) return; // не настроено — пропускаем

  const itemsHtml = order.items
    .map(i => `<tr><td>${productMap[i.productId]?.name ?? i.productId}</td><td>${i.quantity}</td><td>${(i.price * i.quantity).toLocaleString('ru-RU')} ₽</td></tr>`)
    .join('');

  const html = `
    <h2>Заказ #${order.id}</h2>
    <p><b>Имя:</b> ${order.name}</p>
    <p><b>Телефон:</b> ${order.phone}</p>
    ${order.address ? `<p><b>Адрес:</b> ${order.address}</p>` : ''}
    ${order.comment ? `<p><b>Комментарий:</b> ${order.comment}</p>` : ''}
    <table border="1" cellpadding="6" cellspacing="0">
      <tr><th>Товар</th><th>Кол-во</th><th>Сумма</th></tr>
      ${itemsHtml}
    </table>
    <p><b>Итого: ${order.total.toLocaleString('ru-RU')} ₽</b></p>
  `;

  // Уведомление менеджеру
  await mailer.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
    subject: `Новый заказ #${order.id} — ${order.name}`,
    html,
  }).catch(() => {});

  // Подтверждение клиенту
  if (order.email) {
    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: order.email,
      subject: `Ваш заказ #${order.id} принят — ValDiLux`,
      html: `<h2>Спасибо за заказ!</h2><p>Мы свяжемся с вами по номеру ${order.phone} в ближайшее время.</p>${html}`,
    }).catch(() => {});
  }
}

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, address, comment, items, delivery, payment, company, inn } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        userId = decoded.userId;
      } catch {}
    }

    if (!name || !phone || !items?.length) {
      return res.status(400).json({ error: 'name, phone and items are required' });
    }

    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    const total = items.reduce((sum, i) => sum + (productMap[i.productId]?.price ?? 0) * i.quantity, 0);

    const commentFull = [
      comment,
      delivery ? `Доставка: ${delivery}` : null,
      payment ? `Оплата: ${payment}` : null,
      company ? `Компания: ${company}` : null,
      inn ? `ИНН: ${inn}` : null,
    ].filter(Boolean).join('\n');

    const order = await prisma.order.create({
      data: {
        userId,
        name, phone, email, address,
        comment: commentFull || null,
        total,
        items: {
          create: items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: productMap[i.productId]?.price ?? 0,
          })),
        },
      },
      include: { items: true },
    });

    sendOrderEmails(order, productMap); // fire-and-forget

    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
