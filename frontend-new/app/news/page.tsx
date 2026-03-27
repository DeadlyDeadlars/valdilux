import Link from 'next/link';
import { api } from '@/lib/api';

type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  image?: string;
  createdAt: string;
};

export default async function NewsPage() {
  let posts: Post[] = [];
  try {
    posts = await api.get<Post[]>('/posts?type=news');
  } catch {}

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(201,169,110,0.08)', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label mb-6">Новости</div>
          <h1 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Акции и новости</h1>
        </div>
      </div>

      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#4a4540', fontSize: '0.85rem', padding: '3rem 0' }}>Пока нет новостей</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {posts.map(post => (
              <Link key={post.id} href={`/news/${post.slug}`} style={{ textDecoration: 'none', background: '#141414', border: '1px solid rgba(201,169,110,0.08)', padding: '2rem', transition: 'border-color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.08)')}
              >
                <div style={{ color: '#4a4540', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                </div>
                <h2 className="serif" style={{ color: '#f0ebe3', fontSize: '1.5rem', fontWeight: 300, marginBottom: '1rem' }}>{post.title}</h2>
                <p style={{ color: '#6a6058', fontSize: '0.85rem', lineHeight: 1.8 }}>{post.content.slice(0, 200)}...</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
