'use client';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || '';

const empty = { title: '', slug: '', content: '', type: 'article', image: '', published: false };

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${API}/posts/all`, { headers: { 'x-admin-pass': PASS } })
      .then(r => r.ok ? r.json() : []).then(setPosts).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API}/posts/${editing}` : `${API}/posts`;
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-admin-pass': PASS }, body: JSON.stringify(form) });
    setForm(empty); setEditing(null); load();
  };

  const remove = async (id: number) => {
    await fetch(`${API}/posts/${id}`, { method: 'DELETE', headers: { 'x-admin-pass': PASS } });
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const inp = { background: '#1a1a1a', border: '1px solid rgba(201,169,110,0.12)', color: 'var(--text2)', padding: '0.6rem 0.75rem', fontSize: '0.78rem', outline: 'none', width: '100%' };

  return (
    <div>
      <h1 className="serif" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem' }}>Посты</h1>
      <form onSubmit={save} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <input required placeholder="Заголовок" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inp} />
        <input required placeholder="slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inp} />
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inp }}>
          <option value="article">Статья</option>
          <option value="news">Новость</option>
          <option value="promo">Акция</option>
        </select>
        <input placeholder="URL изображения" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} style={inp} />
        <textarea required placeholder="Содержимое" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={4} style={{ ...inp, gridColumn: '1/-1', resize: 'vertical' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.75rem' }}>
          <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
          Опубликовать
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          {editing && <button type="button" onClick={() => { setForm(empty); setEditing(null); }} style={{ padding: '0.5rem 1rem', background: 'none', border: '1px solid rgba(201,169,110,0.2)', color: 'var(--muted)', fontSize: '0.7rem', cursor: 'pointer' }}>Отмена</button>}
          <button type="submit" className="btn-gold-solid" style={{ border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}>{editing ? 'Сохранить' : 'Добавить'}</button>
        </div>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {posts.map(p => (
          <div key={p.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '0.875rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>{p.title}</span>
              <span style={{ color: 'var(--muted2)', fontSize: '0.65rem', marginLeft: '0.75rem' }}>{p.type}</span>
              <span style={{ color: p.published ? '#6a8060' : '#806060', fontSize: '0.65rem', marginLeft: '0.75rem' }}>{p.published ? '● опубликован' : '○ черновик'}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => { setForm({ title: p.title, slug: p.slug, content: p.content, type: p.type, image: p.image || '', published: p.published }); setEditing(p.id); }}
                style={{ background: 'none', border: 'none', color: '#c9a96e', fontSize: '0.7rem', cursor: 'pointer' }}>Ред.</button>
              <button onClick={() => remove(p.id)} style={{ background: 'none', border: 'none', color: '#c06060', fontSize: '0.7rem', cursor: 'pointer' }}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
