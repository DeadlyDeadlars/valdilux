import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Блог о мебели из массива дерева — ValDiLux',
  description: 'Полезные статьи о выборе, уходе и изготовлении мебели из массива дуба, бука и ясеня. Советы по обустройству кабинета.',
  openGraph: {
    title: 'Блог о мебели из массива дерева — ValDiLux',
    description: 'Советы по выбору и уходу за мебелью из массива дерева.',
  },
};

type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string;
  createdAt: string;
};

export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    posts = await api.get<Post[]>('/posts?type=article');
  } catch {}

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label mb-6">Блог</div>
          <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Статьи и советы</h1>
        </div>
      </div>

      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--muted2)', fontSize: '0.85rem', padding: '3rem 0' }}>Пока нет статей</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1.5rem' }}
              >
                <div style={{ color: 'var(--muted2)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                </div>
                <h2 className="serif" style={{ color: 'var(--text)', fontSize: '1.25rem', fontWeight: 300, marginBottom: '0.75rem' }}>{post.title}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.7 }}>{post.content.slice(0, 150)}...</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
