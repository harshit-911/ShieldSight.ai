import React from 'react';
import { APP_INFO } from '../utils/constants';

export const Header: React.FC = () => {
  return (
    <header className="text-center pt-2 pb-1">
      <div className="flex items-center justify-center gap-2.5 mb-1">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8s0 0 0 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          {APP_INFO.NAME}
        </h1>
      </div>
      <p className="text-xs text-slate-400 font-medium">
        {APP_INFO.TAGLINE}
      </p>
    </header>
  );
};
