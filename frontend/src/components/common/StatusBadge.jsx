import React from 'react'

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  published: 'bg-primary-50 text-primary-700 border border-primary-200',
  verified: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  pending: 'bg-slate-100 text-slate-700 border border-slate-200',
  review: 'bg-primary-50 text-primary-700 border border-primary-200',
  draft: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  invited: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
  suspended: 'bg-amber-50 text-amber-700 border border-amber-200',
  banned: 'bg-red-50 text-red-700 border border-red-200',
  deleted: 'bg-slate-100 text-slate-500 border border-slate-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
  archived: 'bg-neutral-100 text-neutral-500 border border-neutral-200',
  inactive: 'bg-neutral-100 text-neutral-500 border border-neutral-200',
};


function formatStatus(status) {
  const s = String(status || 'unknown').toLowerCase();
  if (s === 'draft') return 'Draft';
  if (s === 'pending') return 'Pending';
  if (s === 'approved') return 'Live';
  if (s === 'rejected') return 'Needs Changes';
  if (s === 'suspended') return 'Suspended';
  if (s === 'banned') return 'Banned';
  if (s === 'deleted') return 'Deleted';
  return String(status || 'unknown')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
function StatusBadge({ status = 'unknown', label, className = '' }) {
  const key = String(status).toLowerCase()
  const badgeClass = statusStyles[key] || 'bg-neutral-100 text-neutral-700 border border-neutral-200'

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass} ${className}`}>
      {label || formatStatus(status)}
    </span>
  )
}
export default StatusBadge
