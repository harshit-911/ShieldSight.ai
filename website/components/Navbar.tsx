'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Download, Github, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1220]/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center group-hover:border-blue-500/60 transition-all">
              <Shield className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                ShieldSight <span className="text-blue-500 text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium">
              How It Works
            </Link>
            <Link href="#privacy" className="text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium">
              Privacy
            </Link>
            <Link href="#demo" className="text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium">
              Live Demo
            </Link>
            <Link href="#faq" className="text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium">
              FAQ
            </Link>
          </nav>

          {/* CTA Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/harshit-911/ShieldSight.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
            <Link
              href="#download"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Download Extension
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 border-t border-slate-800/80 mt-4 flex flex-col gap-4">
            <Link
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-slate-300 hover:text-white py-1"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-slate-300 hover:text-white py-1"
            >
              How It Works
            </Link>
            <Link
              href="#privacy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-slate-300 hover:text-white py-1"
            >
              Privacy
            </Link>
            <Link
              href="#demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-slate-300 hover:text-white py-1"
            >
              Live Demo
            </Link>
            <Link
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-slate-300 hover:text-white py-1"
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="#download"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold"
              >
                <Download className="w-4 h-4" />
                Download Extension
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
