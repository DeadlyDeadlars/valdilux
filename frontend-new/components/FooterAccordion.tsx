export default function FooterAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{'summary::-webkit-details-marker{display:none}'}</style>
      <details className="group md:hidden">
        <summary
          className="section-label"
          style={{
            fontSize: '0.55rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            cursor: 'pointer',
            padding: '0.75rem 0',
            borderBottom: '1px solid rgba(201,169,110,0.08)',
            listStyle: 'none',
          }}
        >
          {title}
          <span
            className="group-open:rotate-180"
            style={{ color: 'var(--muted2)', fontSize: '0.7rem', transition: 'transform 0.2s' }}
          >
            ▼
          </span>
        </summary>
        <div className="pt-3 pb-1">{children}</div>
      </details>
      <div className="hidden md:block">
        <div className="section-label mb-3 md:mb-4 md:text-xs" style={{ fontSize: '0.55rem' }}>{title}</div>
        {children}
      </div>
    </>
  );
}
