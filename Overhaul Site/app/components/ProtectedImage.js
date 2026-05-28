'use client';

import Image from 'next/image';

export default function ProtectedImage({ src, alt, fill, width, height, className, style, imgStyle, sizes, priority, unoptimized }) {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div 
      className={`protected-image-wrapper ${className || ''}`}
      onContextMenu={handleContextMenu}
      style={{ position: 'relative', width: fill ? '100%' : (width || '100%'), height: fill ? '100%' : (height || '100%'), ...style }}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
        draggable={false}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          objectFit: 'cover',
          ...imgStyle,
        }}
      />
      <div 
        className="protected-overlay" 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          background: 'transparent',
          pointerEvents: 'auto'
        }}
      />
    </div>
  );
}
