import jwt from 'jsonwebtoken';

const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function adminAuth(req, res, next) {
  const adminPass = req.headers['x-admin-pass'];
  if (adminPass === ADMIN_PASS) return next();

  if (adminPass) {
    try {
      const decoded = jwt.verify(adminPass, JWT_SECRET);
      if (decoded.role === 'admin') return next();
    } catch {}
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.role === 'admin') return next();
    } catch {}
  }

  res.status(401).json({ error: 'Unauthorized' });
}
