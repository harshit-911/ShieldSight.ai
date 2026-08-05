import Link from 'next/link';
import { Shield, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B1220] border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                ShieldSight <span className="text-blue-500 text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span>
              </span>
            </Link>
            <p className="text-sm font-semibold text-slate-300">
              Protecting Every Click. Protecting Every Family.
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              On-device multimodal AI content moderation engine built with privacy-first Chrome Extension Manifest V3 architecture.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Product & Docs
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="#features" className="hover:text-slate-200 transition-colors">Features</Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-slate-200 transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="#demo" className="hover:text-slate-200 transition-colors">Interactive Demo</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-slate-200 transition-colors">Documentation</Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Resources & Privacy
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <a href="https://github.com/harshit-911/ShieldSight.ai" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="mailto:contact@shieldsight.ai" className="hover:text-slate-200 transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} ShieldSight AI. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Designed for consumer safety with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
