import React from 'react';

export default function Badge({ children, variant = 'neutral', className = '', ...props }) {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider border';
  const variants = {
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    cyan: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80',
    rose: 'bg-rose-950/60 text-rose-300 border-rose-800/80',
    amber: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
    emerald: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
    purple: 'bg-purple-950/60 text-purple-300 border-purple-800/80'
  };

  return (
    <span className={`${base} ${variants[variant] || variants.neutral} ${className}`} {...props}>
      {children}
    </span>
  );
}
