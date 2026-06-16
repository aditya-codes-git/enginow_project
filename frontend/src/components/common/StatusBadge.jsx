import React from 'react'

const statusStyles = {
  active: 'bg-accent-50 text-accent-700 border border-accent-200',
  approved: 'bg-accent-50 text-accent-700 border border-accent-200',
  published: 'bg-primary-50 text-primary-700 border border-primary-200',
  verified: 'bg-accent-50 text-accent-700 border border-accent-200',
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  review: 'bg-primary-50 text-primary-700 border border-primary-200',
  draft: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  invited: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
  suspended: 'bg-red-50 text-red-700 border border-red-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
  archived: 'bg-neutral-100 text-neutral-500 border border-neutral-200',
  inactive: 'bg-neutral-100 text-neutral-500 border border-neutral-200',
}


function formatStatus(status) {
  const s = String(status || 'unknown').toLowerCase()
  if (s === 'draft') return 'Draft'
  if (s === 'pending') return 'Waiting Approval'
  if (s === 'approved') return 'Live'
  if (s === 'rejected') return 'Needs Changes'
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
