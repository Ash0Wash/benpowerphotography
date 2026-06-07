'use client';
import React, { useState, useEffect } from 'react';

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

  return (
    <div style={{ 
      columnCount: columns, 
      columnGap: '1.5rem', 
      padding: '1.5rem 0' 
    }}>
      {React.Children.map(children, (child, i) => (
        <div key={i} style={{ breakInside: 'avoid', marginBottom: '1.5rem', display: 'inline-block', width: '100%' }}>
          {child}
        </div>
      ))}
    </div>
  );
}
