import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, glow = false, className = '', ...props }) => {
  return (
    <div
      className={`relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 transition-all duration-300 ${
        glow ? 'shadow-lg shadow-sky-500/5 hover:border-sky-500/30' : 'hover:border-slate-700/80'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
