import React from 'react'

/**
 * Reusable text block that safely wraps long descriptions, URLs,
 * code-like strings, and preserves line breaks from the source text.
 *
 * @param {Object}  props
 * @param {React.ReactNode} props.children  – content to render
 * @param {string}  [props.className]       – extra Tailwind classes
 * @param {'base'|'sm'|'xs'} [props.size]   – text size preset
 */
export default function TextBlock({ children, className = '', size = 'base' }) {
  const sizeMap = {
    xs: 'text-xs leading-5',
    sm: 'text-sm leading-6',
    base: 'text-base leading-7',
  }

  if (!children) return null

  return (
    <p
      className={`
        whitespace-pre-wrap
        break-words
        overflow-wrap-anywhere
        overflow-hidden
        max-w-full
        text-slate-600
        ${sizeMap[size] || sizeMap.base}
        ${className}
      `.trim()}
      style={{ overflowWrap: 'anywhere' }}
    >
      {children}
    </p>
  )
}
