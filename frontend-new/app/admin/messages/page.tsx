'use client';
import { useEffect, useState, useMemo } from 'react';
import AdminPagination from '@/components/admin/Pagination';
import styles from './Messages.module.css';

const PROXY = '/api/admin/proxy';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const limit = 20;

  const load = () => {
    setLoading(true);
    fetch(`${PROXY}/contact/all?page=${page}&limit=${limit}`)
      .then(r => r.ok ? r.json() : { data: [], total: 0 })
      .then(d => { setMessages(d.data || []); setTotal(d.total || 0); })
      .finally(() => setLoading(false));
  };
  useEffect(load, [page]);

  const filtered = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.toLowerCase();
    return messages.filter(m =>
      m.name?.toLowerCase().includes(q) ||
      m.phone?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q)
    );
  }, [messages, search]);

  const remove = async (id: number) => {
    if (!confirm('Удалить заявку?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`${PROXY}/contact/${id}`, { method: 'DELETE' });
      if (res.ok) setMessages(prev => prev.filter(m => m.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const typeInfo = (m: any) => {
    if (m.message?.startsWith('Обратный звонок')) return { label: 'Звонок', color: '#6a8060' };
    if (m.message?.startsWith('Вопрос по товару')) return { label: 'Вопрос', color: '#c9a96e' };
    return { label: 'Сообщение', color: '#6a8090' };
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={`serif ${styles.title}`}>
          Заявки
          {!loading && <span className={styles.titleCount}>{total}</span>}
        </h1>
        <input
          type="text"
          placeholder="Поиск по имени, телефону, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          {search ? 'Ничего не найдено' : 'Нет заявок'}
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                  {['#', 'Тип', 'Имя', 'Телефон', 'Email', 'Сообщение', 'Дата', ''].map(h => (
                    <th key={h} className={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className={styles.tbody}>
                {filtered.map(m => {
                  const info = typeInfo(m);
                  return (
                    <tr key={m.id} className={styles.tr}>
                      <td className={`${styles.td} ${styles.idCell}`} data-label="#">{m.id}</td>
                      <td className={styles.td} data-label="Тип">
                        <span className={styles.typeBadge} style={{ color: info.color }}>{info.label}</span>
                      </td>
                      <td className={styles.td} data-label="Имя">{m.name}</td>
                      <td className={styles.td} data-label="Телефон">
                        {m.phone && <a href={`tel:${m.phone}`} className={styles.phoneLink}>{m.phone}</a>}
                      </td>
                      <td className={`${styles.td} ${styles.tdMuted}`} data-label="Email">{m.email || '—'}</td>
                      <td className={`${styles.td} ${styles.tdMuted} ${styles.messageCell}`} data-label="Сообщение">{m.message}</td>
                      <td className={styles.dateCell + ' ' + styles.td} data-label="Дата">
                        {new Date(m.createdAt).toLocaleString('ru-RU')}
                      </td>
                      <td className={styles.td} data-label="">
                        <button type="button" onClick={() => remove(m.id)}
                          disabled={deleting === m.id}
                          className={styles.deleteBtn}
                          style={{ opacity: deleting === m.id ? 0.5 : 1 }}
                        >
                          {deleting === m.id ? '...' : 'Удалить'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} totalPages={Math.ceil(total / limit)} setPage={setPage} />
        </>
      )}
    </div>
  );
}
