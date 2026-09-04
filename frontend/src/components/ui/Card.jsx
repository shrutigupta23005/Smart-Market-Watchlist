import React from 'react';

export default function Card({ children, className = '', variant = 'default', ...props }) {
  const base = 'rounded-xl border transition-all';
  const variants = {
    default: 'bg-[#12171E] border-slate-800/80',
    muted: 'bg-[#171E27]/60 border-slate-800/60',
    highlight: 'bg-[#12171E] border-cyan-900/60 shadow-cyan-950/20 shadow-md',
    alert: 'bg-[#12171E] border-rose-900/70 shadow-rose-950/20 shadow-md'
  };

  return (
    <div className={`${base} ${variants[variant] || variants.default} ${className}`} {...props}>
      {children}
    </div>
  );
}
