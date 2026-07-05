import React from 'react';

export default function AuthDivider({ text = 'or continue with' }) {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-1 h-px bg-theme-border/60" />
      <span className="px-4 text-[11px] font-semibold uppercase tracking-widest text-theme-text-muted">
        {text}
      </span>
      <div className="flex-1 h-px bg-theme-border/60" />
    </div>
  );
}
