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

export default async function CasesPage() {
  let posts: Post[] = [];
  try {
    posts = await api.get<Post[]>('/posts?type=case');
  } catch {}

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(201,169,110,0.08)', padding: '4rem 1.5rem 3rem' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label mb-6">Портфолио</div>
          <h1 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300 }}>Наши проекты</h1>
          <p style={{ color: '#6a6058', fontSize: '0.85rem', marginTop: '1rem' }}>Реализованные проекты для наших клиентов</p>
        </div>
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#4a4540', fontSize: '0.85rem', padding: '3rem 0' }}>Пока нет кейсов</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post.id} href={`/cases/${post.slug}`} style={{ textDecoration: 'none', background: '#141414', border: '1px solid rgba(201,169,110,0.08)', overflow: 'hidden', transition: 'border-color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.08)')}
              >
                {post.image && (
                  <div style={{ aspectRatio: '16/9', background: '#1a1a1a', overflow: 'hidden' }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <h2 className="serif" style={{ color: '#f0ebe3', fontSize: '1.15rem', fontWeight: 300, marginBottom: '0.75rem' }}>{post.title}</h2>
                  <p style={{ color: '#6a6058', fontSize: '0.75rem', lineHeight: 1.7 }}>{post.content.slice(0, 120)}...</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
