'use client';
import { useEffect, useState } from 'react';

const PROXY = '/api/admin/proxy';

const empty = { name: '', slug: '', image: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch(`${PROXY}/categories`)
      .then(r => r.ok ? r.json() : []).then(setCategories).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${PROXY}/categories/${editing}` : `${PROXY}/categories`;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm(empty); setEditing(null); load();
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить категорию?')) return;
    await fetch(`${PROXY}/categories/${id}`, { method: 'DELETE' });
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const startEdit = (c: any) => {
    setForm({ name: c.name, slug: c.slug, image: c.image || '' });
    setEditing(c.id);
  };

  const inp = { background: '#1a1a1a', border: '1px solid rgba(201,169,110,0.12)', color: 'var(--text2)', padding: '0.6rem 0.75rem', fontSize: '0.78rem', outline: 'none', width: '100%' };

  return (
    <div>
      <h1 className="serif" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem' }}>Категории</h1>

      <form onSubmit={save} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <input required placeholder="Название" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} />
        <input required placeholder="slug (naprimer-tables)" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inp} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input placeholder="URL изображения (опционально)" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} style={inp} />
          <button type="submit" className="btn-gold-solid" style={{ border: 'none', cursor: 'pointer', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
            {editing ? 'Сохранить' : 'Добавить'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setForm(empty); setEditing(null); }}
              style={{ padding: '0.5rem 0.75rem', background: 'none', border: '1px solid rgba(201,169,110,0.2)', color: 'var(--muted)', fontSize: '0.7rem', cursor: 'pointer' }}>
              Отмена
            </button>
          )}
        </div>
      </form>

      {loading ? <div style={{ color: 'var(--muted2)' }}>Загрузка...</div> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
              {['#', 'Название', 'Slug', 'Товаров', ''].map(h => (
                <th key={h} style={{ padding: '0.5rem 1rem', color: 'var(--muted2)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--muted2)', fontSize: '0.78rem', borderBottom: '1px solid var(--border)' }}>{c.id}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text2)', fontSize: '0.78rem', borderBottom: '1px solid var(--border)' }}>{c.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--muted)', fontSize: '0.78rem', borderBottom: '1px solid var(--border)' }}>{c.slug}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#c9a96e', fontSize: '0.78rem', borderBottom: '1px solid var(--border)' }}>{c._count?.products ?? 0}</td>
                <td style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEdit(c)} style={{ background: 'none', border: 'none', color: '#c9a96e', fontSize: '0.7rem', cursor: 'pointer' }}>Ред.</button>
                    <button onClick={() => remove(c.id)} style={{ background: 'none', border: 'none', color: '#c06060', fontSize: '0.7rem', cursor: 'pointer' }}>Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
