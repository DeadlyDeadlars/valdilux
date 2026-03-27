import { prisma } from '../db.js';
import { Router } from 'express';

const router = Router();

router.get('/yandex', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { inStock: true },
      include: { category: true },
    });

    const shopUrl = process.env.FRONTEND_URL || 'https://valdilux-mebel.ru';
    const apiBase = process.env.API_BASE_URL || 'http://localhost:4000';

    const offers = products.map(p => {
      const images = JSON.parse(p.images || '[]');
      const imgTags = images.slice(0, 10).map(img => `<picture>${shopUrl}${img}</picture>`).join('');
      return `
    <offer id="${p.id}" available="true">
      <url>${shopUrl}/catalog/${p.slug}</url>
      <name>${escXml(p.name)}</name>
      <price>${p.price}</price>
      <currencyId>RUR</currencyId>
      <categoryId>${p.categoryId}</categoryId>
      ${imgTags}
      <description>${escXml(p.description || p.name)}</description>
      ${p.material ? `<param name="Материал">${escXml(p.material)}</param>` : ''}
      ${p.label === 'hit' ? '<param name="Ярлык">Хит продаж</param>' : ''}
      ${p.label === 'new' ? '<param name="Ярлык">Новинка</param>' : ''}
      <vendor>ValDiLux</vendor>
      <delivery>true</delivery>
    </offer>`;
    }).join('');

    const categories = await prisma.category.findMany();
    const catTags = categories.map(c => `<category id="${c.id}">${escXml(c.name)}</category>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE yml_catalog SYSTEM "shops.dtd">
<yml_catalog date="${new Date().toISOString().slice(0, 16)}">
  <shop>
    <name>ValDiLux</name>
    <company>ValDiLux</company>
    <url>${shopUrl}</url>
    <currencies><currency id="RUR" rate="1"/></currencies>
    <categories>${catTags}</categories>
    <offers>${offers}</offers>
  </shop>
</yml_catalog>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function escXml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default router;
