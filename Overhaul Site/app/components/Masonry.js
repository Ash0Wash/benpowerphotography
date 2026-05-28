'use client';
import { useState, useEffect } from 'react';

export default function Masonry({ children, columnsObj = { default: 3, 1024: 2, 640: 1 } }) {
  const [columns, setColumns] = useState(columnsObj.default);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColumns(columnsObj[640]);
      } else if (width < 1024) {
        setColumns(columnsObj[1024]);
      } else {
        setColumns(columnsObj.default);
      }
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columnsObj]);

  const columnArrays = Array.from({ length: columns }, () => []);
  
  // React.Children.toArray is needed to safely iterate over children
  const childrenArray = Array.isArray(children) ? children : [children];
  
  childrenArray.forEach((child, index) => {
    if (!child) return;
    columnArrays[index % columns].push(child);
  });

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', padding: '1.5rem 0' }}>
      {columnArrays.map((col, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {col}
        </div>
      ))}
    </div>
  );
}
