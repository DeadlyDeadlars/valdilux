'use client';
import { useState } from 'react';

export default function ProductGallery({
  images,
  video,
  name,
  apiBase,
}: {
  images: string[];
  video?: string;
  name: string;
  apiBase: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const allMedia = [
    ...images.map(src => ({ type: 'image' as const, src })),
    ...(video ? [{ type: 'video' as const, src: video }] : []),
  ];

  if (allMedia.length === 0) {
    return (
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 80, height: 80, border: '1px solid rgba(201,169,110,0.15)', borderRadius: '50%' }} />
      </div>
    );
  }

  const current = allMedia[active];

  return (
    <>
      {/* Main media */}
      <div>
        <div
          style={{ background: 'var(--bg3)', border: '1px solid var(--border)', aspectRatio: '4/3', overflow: 'hidden', cursor: current.type === 'image' ? 'zoom-in' : 'default', position: 'relative' }}
          onClick={() => current.type === 'image' && setLightbox(true)}
        >
          {current.type === 'image' ? (
            <img src={`${apiBase}${current.src}`} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src={`${apiBase}${current.src}`} type="video/mp4" />
            </video>
          )}
          {current.type === 'image' && (
            <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(10,10,10,0.6)', padding: '4px 8px' }}>
              <span style={{ color: '#c9a96e', fontSize: '0.55rem', letterSpacing: '0.1em' }}>УВЕЛИЧИТЬ</span>
            </div>
          )}

          {allMedia.length > 1 && current.type === 'image' && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setActive(a => (a - 1 + allMedia.length) % allMedia.length); }}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(10,10,10,0.5)', border: 'none', color: '#c9a96e', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem 0.6rem', lineHeight: 1, borderRadius: 4, transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.5)')}
              >‹</button>
              <button
                onClick={e => { e.stopPropagation(); setActive(a => (a + 1) % allMedia.length); }}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(10,10,10,0.5)', border: 'none', color: '#c9a96e', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem 0.6rem', lineHeight: 1, borderRadius: 4, transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(10,10,10,0.5)')}
              >›</button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && current.type === 'image' && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setLightbox(false)}
        >
          <img
            src={`${apiBase}${current.src}`}
            alt={name}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(false)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#c9a96e', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}
          >×</button>
          {allMedia.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setActive(a => (a - 1 + allMedia.length) % allMedia.length); }}
                style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem 0.75rem', lineHeight: 1 }}
              >‹</button>
              <button
                onClick={e => { e.stopPropagation(); setActive(a => (a + 1) % allMedia.length); }}
                style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem 0.75rem', lineHeight: 1 }}
              >›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
