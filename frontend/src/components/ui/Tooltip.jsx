import React, { useState } from 'react';

export default function Tooltip({ text, children, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div
          className={`absolute z-50 px-2.5 py-1 text-[11px] font-mono rounded bg-slate-900 text-slate-200 border border-slate-700 shadow-xl whitespace-nowrap pointer-events-none transition-opacity duration-150 ${
            position === 'top'
              ? 'bottom-full mb-1.5 left-1/2 -translate-x-1/2'
              : 'top-full mt-1.5 left-1/2 -translate-x-1/2'
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
