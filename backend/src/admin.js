import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';

AdminJS.registerAdapter({ Database, Resource });

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@valdilux.ru';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

export async function setupAdmin(app) {
  const adminJs = new AdminJS({
    databases: [prisma],
    rootPath: '/admin',
    branding: {
      companyName: 'ValDiLux Admin',
      logo: false,
    },
  });

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email, password) => {
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
          return { email };
        }
        return null;
      },
      cookieName: 'adminjs',
      cookiePassword: process.env.SESSION_SECRET || 'valdilux-admin-secret-32chars!!',
    },
    null,
    {
      resave: false,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET || 'valdilux-admin-secret-32chars!!',
    }
  );

  app.use('/admin', adminRouter);
  console.log(`✅ AdminJS available at http://localhost:${process.env.PORT || 4000}/admin`);
}
