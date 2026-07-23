import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

async function yooRequest(method, path, body) {
  const auth = Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64');
  const res = await fetch(`https://api.yookassa.ru/v3${path}`, {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Idempotence-Key': Date.now().toString(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`YooKassa error ${res.status}`);
  return res.json();
}

// Создать платёж
router.post('/create', async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const payment = await yooRequest('POST', '/payments', {
      amount: { value: order.total.toFixed(2), currency: 'RUB' },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.FRONTEND_URL}/account?payment=success`,
      },
      description: `Заказ #${order.id}`,
      metadata: { orderId: order.id },
      capture: true,
    });

    res.json({ confirmationUrl: payment.confirmation.confirmation_url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Webhook от ЮKassa
router.post('/webhook', async (req, res) => {
  try {
    const { event, object } = req.body;
    if (event === 'payment.succeeded' && object?.status === 'succeeded') {
      const orderId = parseInt(object.metadata.orderId);
      if (!orderId) return res.status(400).json({ error: 'Invalid orderId' });
      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) return res.status(404).json({ error: 'Order not found' });
      await prisma.order.update({ where: { id: orderId }, data: { status: 'paid' } });
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
