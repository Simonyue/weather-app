import React, { HTMLAttributes } from 'react';

export const Skeleton: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-slate-800/80 rounded-xl ${className}`}
      {...props}
    />
  );
};

export const WeatherHeroSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <div className="flex items-baseline gap-4">
        <Skeleton className="h-20 w-36" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/60">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  );
};
