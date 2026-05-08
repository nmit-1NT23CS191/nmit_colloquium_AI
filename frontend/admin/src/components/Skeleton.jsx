import React from 'react';

/**
 * Skeleton component for loading states.
 * @param {string} className - Additional classes (e.g., h-4 w-full)
 * @param {string} type - 'text', 'circle', 'rect'
 */
export default function Skeleton({ className = "", type = "text" }) {
  const baseClass = "skeleton animate-pulse bg-slate-200 dark:bg-slate-800";
  
  const typeClasses = {
    text: "h-4 w-full rounded",
    circle: "rounded-full",
    rect: "rounded-xl"
  };

  return (
    <div className={`${baseClass} ${typeClasses[type] || ""} ${className}`} />
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div className="space-y-4 w-full">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          {[...Array(cols)].map((_, j) => (
            <Skeleton key={j} className={`h-4 ${j === 0 ? 'w-1/4' : 'flex-1'}`} />
          ))}
        </div>
      ))}
    </div>
  );
}
