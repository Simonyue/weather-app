import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4">
        <p>
          Weather data provided by{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-sky-300 transition-colors underline underline-offset-2"
          >
            Open-Meteo
          </a>
        </p>
      </div>
    </footer>
  );
};
