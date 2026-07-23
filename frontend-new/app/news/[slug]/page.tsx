import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { api } from '@/lib/api';
import postsData from '@/public/posts.json';

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export async function generateStaticParams() {
  return (postsData as any[]).filter((p: any) => p.type === 'news').map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await api.get<Post>(`/posts/${params.slug}`);
    return {
      title: `${post.title} — новости ValDiLux`,
      description: post.content.slice(0, 160).replace(/[#*\n]/g, ' '),
      openGraph: {
        title: `${post.title} — новости ValDiLux`,
        description: post.content.slice(0, 160).replace(/[#*\n]/g, ' '),
      },
    };
  } catch {
    return { title: 'Новость — ValDiLux' };
  }
}

export default async function NewsPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  let post: Post;
  try {
    post = await api.get<Post>(`/posts/${slug}`);
  } catch {
    notFound();
  }

  return (
    <div style={{ paddingTop: '5rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <Link href="/news" style={{ color: 'var(--muted)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
          ← Все новости
        </Link>

        <div style={{ color: 'var(--muted2)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          {new Date(post.createdAt).toLocaleDateString('ru-RU')}
        </div>
        <h1 className="serif" style={{ color: 'var(--text)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: '2rem' }}>
          {post.title}
        </h1>
        <div style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>
      </div>
    </div>
  );
}
