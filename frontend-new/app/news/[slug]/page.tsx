import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: Post;
  try {
    post = await api.get<Post>(`/posts/${slug}`);
  } catch {
    notFound();
  }

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <Link href="/news" style={{ color: '#6a6058', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
          ← Все новости
        </Link>

        <div style={{ color: '#4a4540', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          {new Date(post.createdAt).toLocaleDateString('ru-RU')}
        </div>
        <h1 className="serif" style={{ color: '#f0ebe3', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '2rem' }}>
          {post.title}
        </h1>
        <div style={{ color: '#6a6058', fontSize: '0.95rem', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>
      </div>
    </div>
  );
}
