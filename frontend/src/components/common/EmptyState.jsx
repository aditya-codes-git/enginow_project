import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({
  title = "No data available",
  description = "There are no items to show at the moment.",
  icon: Icon = FolderOpen,
  actionText,
  actionHref,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 max-w-lg mx-auto">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-6 shadow-sm">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="font-outfit text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed">{description}</p>
      
      {(actionText && (actionHref || onAction)) && (
        <div className="mt-6">
          {actionHref ? (
            <Link
              to={actionHref}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition text-sm cursor-pointer"
            >
              {actionText}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-md hover:shadow-lg transition text-sm cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
