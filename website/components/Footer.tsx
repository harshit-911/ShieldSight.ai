import Link from 'next/link';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B1220] border-t border-slate-800/40 pt-14 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/40">
          {/* Brand */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-slate-100" />
              </div>
              <span className="font-semibold text-sm text-slate-100 tracking-tight">
                ShieldSight <span className="text-slate-400 font-normal text-xs">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 font-medium">
              Protecting Every Click. Protecting Every Family.
            </p>
            <div className="inline-block px-2.5 py-0.5 rounded-full border border-slate-800 bg-slate-900/60 text-[10px] font-mono text-slate-400">
              Version 1.0.0 Beta
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Product
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link href="/#features" className="hover:text-slate-200 transition-colors">Features</Link>
              </li>
              <li>
                <Link href="/#privacy" className="hover:text-slate-200 transition-colors">Privacy</Link>
              </li>
              <li>
                <Link href="/install" className="hover:text-slate-200 transition-colors">Installation Guide</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-slate-200 transition-colors">Documentation</Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Resources & Legal
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <a href="https://github.com/harshit-911/ShieldSight.ai" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://github.com/harshit-911/ShieldSight.ai/issues/new" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ShieldSight AI. All rights reserved.
          </div>
          <div className="font-mono text-[10px]">
            Manifest V3 • 100% On-Device AI
          </div>
        </div>
      </div>
    </footer>
  );
}
