import React from 'react';
import { APP_INFO } from '../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-4 pt-2 text-center border-t border-slate-800">
      <span className="text-xs font-medium text-slate-500">
        Version {APP_INFO.VERSION}
      </span>
    </footer>
  );
};
