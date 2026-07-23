'use client';

import { useEffect, useRef, useState } from 'react';

interface ProductDescriptionOverflowProps {
  children: React.ReactNode;
  galleryRef?: React.RefObject<HTMLElement>;
}

export default function ProductDescriptionOverflow({ 
  children, 
  galleryRef 
}: ProductDescriptionOverflowProps) {
  const descriptionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [galleryHeight, setGalleryHeight] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      if (!descriptionRef.current || !wrapperRef.current) return;

      // Get gallery height
      let galleryHeightValue = 0;
      if (galleryRef?.current) {
        galleryHeightValue = galleryRef.current.offsetHeight;
      } else {
        // Fallback: find gallery container
        const galleryContainer = document.querySelector('.product-gallery-container');
        if (galleryContainer) {
          galleryHeightValue = galleryContainer.getBoundingClientRect().height;
        }
      }

      setGalleryHeight(galleryHeightValue);

      // Get description position relative to gallery
      const descriptionRect = descriptionRef.current.getBoundingClientRect();
      
      // Check if description exceeds gallery height
      // We add some buffer (50px) to account for padding/margins
      const exceedsGallery = descriptionRect.height > galleryHeightValue - 50;
      
      setHasOverflow(exceedsGallery);
    };

    // Initial check
    checkOverflow();

    // Add resize observer for gallery
    let resizeObserver: ResizeObserver | null = null;
    
    if (galleryRef?.current) {
      resizeObserver = new ResizeObserver(checkOverflow);
      resizeObserver.observe(galleryRef.current);
    } else {
      // Fallback: observe window resize
      window.addEventListener('resize', checkOverflow);
    }

    // Observe description changes
    const descriptionObserver = new MutationObserver(checkOverflow);
    if (descriptionRef.current) {
      descriptionObserver.observe(descriptionRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    // Cleanup
    return () => {
      if (resizeObserver && galleryRef?.current) {
        resizeObserver.unobserve(galleryRef.current);
      } else {
        window.removeEventListener('resize', checkOverflow);
      }
      descriptionObserver.disconnect();
    };
  }, [galleryRef]);

  return (
    <div 
      ref={wrapperRef}
      className={`product-description-wrapper ${hasOverflow ? 'has-overflow' : ''}`}
      data-gallery-height={galleryHeight}
    >
      <div ref={descriptionRef} className="product-description-content">
        {children}
      </div>
    </div>
  );
}
