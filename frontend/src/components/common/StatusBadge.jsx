import React from 'react'

const statusStyles = {
  active: 'bg-accent-50 text-accent-700 border border-accent-200',
  approved: 'bg-accent-50 text-accent-700 border border-accent-200',
  published: 'bg-primary-50 text-primary-700 border border-primary-200',
  verified: 'bg-accent-50 text-accent-700 border border-accent-200',
  pending: 'bg-theme-warning-bg text-theme-warning border border-theme-warning-border',
  review: 'bg-primary-50 text-primary-700 border border-primary-200',
  draft: 'bg-neutral-100 text-theme-text-secondary border border-theme-border',
  invited: 'bg-secondary-50 text-secondary-700 border border-secondary-200',
  suspended: 'bg-theme-error-bg text-theme-error border border-theme-error-border',
  rejected: 'bg-theme-error-bg text-theme-error border border-theme-error-border',
  archived: 'bg-neutral-100 text-theme-text-secondary border border-theme-border',
  inactive: 'bg-neutral-100 text-theme-text-secondary border border-theme-border',
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
  const badgeClass = statusStyles[key] || 'bg-neutral-100 text-theme-text-secondary border border-theme-border'

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass} ${className}`}>
      {label || formatStatus(status)}
    </span>
  )
}
export default StatusBadge
