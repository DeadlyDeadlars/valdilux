'use client';
import Image from 'next/image';
import { useState } from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

export default function ResponsiveImage({
  src,
  alt,
  className,
  style,
  priority = false,
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        style={{
          ...style,
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={95}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#1a1a1a',
          }}
        />
      )}
    </div>
  );
}
