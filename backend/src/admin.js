import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { PrismaClient } from '@prisma/client';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import pkg from '@prisma/internals';
const { getDMMF } = pkg;
import { readFileSync } from 'fs';
import { resolve } from 'path';

AdminJS.registerAdapter({ Database, Resource });

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@valdilux.ru';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

export async function setupAdmin(app) {
  const schemaPath = resolve('./prisma/schema.prisma');
  const datamodel = readFileSync(schemaPath, 'utf-8');
  const dmmf = await getDMMF({ datamodel });

  const adminJs = new AdminJS({
    resources: [
      {
        resource: { model: getModelByName('Product', dmmf), client: prisma },
        options: {
          navigation: { name: 'Каталог', icon: 'Box' },
          properties: {
            images: { isVisible: { list: false, show: true, edit: true, filter: false } },
            options: { isVisible: { list: false, show: true, edit: true, filter: false } },
            description: { type: 'textarea' },
          },
        },
      },
      {
        resource: { model: getModelByName('Category', dmmf), client: prisma },
        options: { navigation: { name: 'Каталог', icon: 'Tag' } },
      },
      {
        resource: { model: getModelByName('Order', dmmf), client: prisma },
        options: {
          navigation: { name: 'Заказы', icon: 'ShoppingCart' },
          actions: { new: { isAccessible: false } },
          properties: {
            status: {
              availableValues: [
                { value: 'new', label: 'Новый' },
                { value: 'processing', label: 'В обработке' },
                { value: 'paid', label: 'Оплачен' },
                { value: 'shipped', label: 'Отправлен' },
                { value: 'delivered', label: 'Доставлен' },
                { value: 'cancelled', label: 'Отменён' },
              ],
            },
          },
        },
      },
      {
        resource: { model: getModelByName('Review', dmmf), client: prisma },
        options: {
          navigation: { name: 'Контент', icon: 'Star' },
          properties: {
            approved: { isVisible: { list: true, show: true, edit: true, filter: true } },
          },
        },
      },
      {
        resource: { model: getModelByName('Post', dmmf), client: prisma },
        options: {
          navigation: { name: 'Контент', icon: 'Edit' },
          properties: {
            content: { type: 'textarea' },
            type: {
              availableValues: [
                { value: 'article', label: 'Статья' },
                { value: 'news', label: 'Новость' },
                { value: 'promo', label: 'Акция' },
              ],
            },
          },
        },
      },
      {
        resource: { model: getModelByName('Coupon', dmmf), client: prisma },
        options: { navigation: { name: 'Маркетинг', icon: 'Percent' } },
      },
      {
        resource: { model: getModelByName('User', dmmf), client: prisma },
        options: {
          navigation: { name: 'Пользователи', icon: 'User' },
          properties: { password: { isVisible: false } },
          actions: { new: { isAccessible: false } },
        },
      },
      {
        resource: { model: getModelByName('ContactMessage', dmmf), client: prisma },
        options: {
          navigation: { name: 'Заявки', icon: 'MessageSquare' },
          actions: { new: { isAccessible: false }, edit: { isAccessible: false } },
        },
      },
    ],
    branding: {
      companyName: 'ValDiLux Admin',
      logo: false,
      favicon: '/favicon.ico',
    },
    locale: {
      language: 'ru',
      translations: {
        ru: {
          actions: {
            new: 'Создать',
            edit: 'Редактировать',
            show: 'Просмотр',
            delete: 'Удалить',
            list: 'Список',
          },
          buttons: {
            save: 'Сохранить',
            addNewItem: 'Добавить',
            filter: 'Фильтр',
            applyChanges: 'Применить',
            resetFilter: 'Сбросить',
            confirmRemovalMany: 'Удалить выбранные',
            logout: 'Выйти',
          },
          labels: {
            Product: 'Товары',
            Category: 'Категории',
            Order: 'Заказы',
            Review: 'Отзывы',
            Post: 'Посты',
            Coupon: 'Купоны',
            User: 'Пользователи',
            ContactMessage: 'Заявки',
          },
        },
      },
    },
    rootPath: '/admin',
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
  console.log(`AdminJS available at http://localhost:${process.env.PORT || 4000}/admin`);
}
