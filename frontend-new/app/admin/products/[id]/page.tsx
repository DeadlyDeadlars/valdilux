'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const PROXY = '/api/admin/proxy';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    material: '',
    label: '',
    inStock: true,
    categoryId: '',
    images: [] as string[],
  });

  useEffect(() => {
    Promise.all([
      fetch(`${PROXY}/categories`).then(r => r.json()),
      fetch(`${PROXY}/admin/products/${id}`).then(r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      }),
    ]).then(([cats, product]) => {
      setCategories(cats);
      if (product) {
        setForm({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          price: String(product.price || ''),
          material: product.material || '',
          label: product.label || '',
          inStock: product.inStock !== false,
          categoryId: String(product.categoryId || ''),
          images: Array.isArray(product.images) ? product.images : [],
        });
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(`${API}/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) uploaded.push(data.url);
      } catch { /* ignore */ }
    }

    setForm(prev => ({ ...prev, images: [...prev.images, ...uploaded] }));
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      alert('Заполните обязательные поля: название, цена, категория');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${PROXY}/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseInt(form.price),
          categoryId: parseInt(form.categoryId),
          images: form.images,
        }),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const err = await res.json();
        alert('Ошибка: ' + err.error);
      }
    } catch {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ color: 'var(--muted2)' }}>Загрузка...</div>;
  if (notFound) return <div style={{ color: '#c06060' }}>Товар не найден</div>;

  const inputStyle = {
    width: '100%',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    color: 'var(--text2)',
    padding: '0.75rem',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    color: 'var(--muted2)',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    marginBottom: '0.5rem',
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <h1 className="serif" style={{ color: 'var(--text)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '2rem' }}>
        Редактировать товар #{id}
      </h1>

      <form onSubmit={submit}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Название *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>URL (slug)</label>
            <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={inputStyle} placeholder="Оставьте пустым для автогенерации" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Цена (₽) *</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Категория *</label>
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} style={inputStyle} required>
                <option value="">Выберите категорию</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Материал</label>
              <select value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} style={inputStyle}>
                <option value="">Без материала</option>
                <option value="oak">Дуб</option>
                <option value="beech">Бук</option>
                <option value="ash">Ясень</option>
                <option value="pine">Сосна</option>
                <option value="birch">Берёза</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Метка</label>
              <select value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} style={inputStyle}>
                <option value="">Без метки</option>
                <option value="hit">Хит продаж</option>
                <option value="new">Новинка</option>
                <option value="sale">Акция</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Описание</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" id="inStock" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} />
            <label htmlFor="inStock" style={{ color: 'var(--text2)', fontSize: '0.85rem', cursor: 'pointer' }}>В наличии</label>
          </div>

          <div>
            <label style={labelStyle}>Изображения</label>
            <input type="file" accept="image/*" multiple onChange={handleUpload}
              style={{ ...inputStyle, padding: '0.5rem' }} disabled={uploading} />
            {uploading && <div style={{ color: '#c9a96e', fontSize: '0.75rem', marginTop: '0.5rem' }}>Загрузка...</div>}

            {form.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem', marginTop: '1rem' }}>
                {form.images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', aspectRatio: '1', border: '1px solid var(--border)' }}>
                    <img src={`${API.replace('/api', '')}${img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removeImage(idx)}
                      style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.7rem' }}>
                      ×
                    </button>
                    {idx === 0 && (
                      <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(201,169,110,0.9)', color: '#0a0a0a', padding: '2px 6px', fontSize: '0.6rem', fontWeight: 'bold' }}>
                        Главное
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={saving} className="btn-gold-solid" style={{ flex: 1 }}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button type="button" onClick={() => router.back()}
              style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '0.75rem', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Отмена
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
