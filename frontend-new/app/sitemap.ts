import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://valdilux.ru';
  
  const routes = [
    '',
    '/catalog',
    '/about',
    '/contacts',
    '/delivery',
    '/payment',
    '/faq',
    '/reviews',
    '/cases',
    '/blog',
    '/news',
    '/individual-projects',
    '/terms',
    '/privacy',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
