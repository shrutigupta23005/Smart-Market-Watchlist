import React from 'react';

export default function Skeleton({ className = '', height = 'h-4', width = 'w-full' }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-800/60 ${height} ${width} ${className}`}
    ></div>
  );
}
