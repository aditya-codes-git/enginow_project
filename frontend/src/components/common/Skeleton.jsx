import React from 'react';

// Basic Pulse Container
export function SkeletonBox({ className = '', style }) {
  return (
    <div
      className={`animate-pulse bg-slate-200 ${className}`}
      style={style}
    />
  );
}

// Paragraph/Text Skeleton
export function SkeletonText({ lines = 3, className = '' }) {
  const widths = ['w-full', 'w-[92%]', 'w-[85%]', 'w-[95%]', 'w-[75%]'];
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox
          key={i}
          className={`h-4 rounded-md ${widths[i % widths.length]}`}
        />
      ))}
    </div>
  );
}

// Generic Card Skeleton
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-theme-border bg-theme-surface p-5 shadow-sm space-y-4 ${className}`}>
      <SkeletonBox className="h-40 w-full rounded-xl" />
      <div className="space-y-2">
        <SkeletonBox className="h-4 w-1/3 rounded" />
        <SkeletonBox className="h-6 w-3/4 rounded-md" />
        <SkeletonBox className="h-4 w-5/6 rounded" />
      </div>
      <div className="flex gap-2 pt-2">
        <SkeletonBox className="h-8 w-20 rounded-lg" />
        <SkeletonBox className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

// Matches EventCard.jsx structure
export function SkeletonEventCard({ featured = false }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-theme-border bg-theme-surface shadow-sm flex flex-col ${featured ? 'lg:grid lg:grid-cols-[1.05fr_1fr]' : ''}`}>
      <div className={`relative ${featured ? 'min-h-72' : 'h-56'}`}>
        <SkeletonBox className="h-full w-full" />
      </div>

      <div className="flex h-full flex-col gap-5 p-5 sm:p-6 flex-grow">
        <div className="space-y-2.5">
          <SkeletonBox className="h-3.5 w-16 rounded-full" />
          <SkeletonBox className="h-7 w-3/4 rounded-lg" />
          <SkeletonBox className="h-4 w-full rounded-md" />
          <SkeletonBox className="h-4 w-5/6 rounded-md" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          <div className="rounded-xl bg-theme-bg p-3 flex flex-col gap-1">
            <SkeletonBox className="h-3 w-10 rounded" />
            <SkeletonBox className="h-4 w-24 rounded-md mt-1" />
          </div>
          <div className="rounded-xl bg-theme-bg p-3 flex flex-col gap-1">
            <SkeletonBox className="h-3 w-12 rounded" />
            <SkeletonBox className="h-4 w-20 rounded-md mt-1" />
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-50">
          <div className="flex gap-2">
            <SkeletonBox className="h-6 w-16 rounded-full" />
            <SkeletonBox className="h-6 w-16 rounded-full" />
          </div>
          <SkeletonBox className="h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Metric Stat Card Skeleton
export function SkeletonStatCard() {
  return (
    <div className="bg-theme-surface rounded-2xl border border-theme-divider border-l-4 border-l-blue-300 p-6 shadow-sm flex flex-col justify-between min-h-[130px]">
      <div className="space-y-2">
        <SkeletonBox className="h-3 w-24 rounded" />
        <SkeletonBox className="h-9 w-16 rounded-lg mt-2" />
      </div>
      <SkeletonBox className="h-3 w-36 rounded mt-4" />
    </div>
  );
}

// Table Skeleton
export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full bg-theme-surface border border-theme-border rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-theme-border bg-theme-bg/50 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBox key={i} className={`h-4 rounded ${i === 0 ? 'w-1/4' : 'w-1/6'}`} />
        ))}
      </div>
      <div className="divide-y divide-slate-150">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="px-6 py-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <SkeletonBox
                key={c}
                className={`h-4 rounded ${
                  c === 0 ? 'w-1/3' : c === cols - 1 ? 'w-12 ml-auto' : 'w-1/6'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default {
  Box: SkeletonBox,
  Text: SkeletonText,
  Card: SkeletonCard,
  EventCard: SkeletonEventCard,
  StatCard: SkeletonStatCard,
  Table: SkeletonTable,
};
