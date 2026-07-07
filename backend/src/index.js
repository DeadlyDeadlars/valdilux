import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { prisma } from './db.js';
// import { setupAdmin } from './admin.js';
import { setupChat } from './chat.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import contactRouter from './routes/contact.js';
import uploadRouter from './routes/upload.js';
import reviewsRouter from './routes/reviews.js';
import postsRouter from './routes/posts.js';
import paymentRouter from './routes/payment.js';
import couponsRouter from './routes/coupons.js';
import { router as authRouter } from './routes/auth.js';
import feedRouter from './routes/feed.js';

const app = express();
const server = createServer(app);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: (origin, cb) => cb(null, !origin || ALLOWED_ORIGINS.includes(origin)), credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static('uploads'));

// Общий лимит
app.use('/api/', rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false }));

// Жёсткий лимит на авторизацию (защита от брутфорса)
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60_000, max: 10, message: { error: 'Слишком много попыток. Попробуйте через 15 минут.' } }));
app.use('/api/auth/register', rateLimit({ windowMs: 60_000, max: 5, message: { error: 'Слишком много регистраций.' } }));

// await setupAdmin(app).catch(e => console.error('AdminJS failed to load:', e.message));

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/contact', contactRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/posts', postsRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/feed', feedRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
  setupChat(server);
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});

export { prisma };
