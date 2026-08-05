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
          ? 'bg-[#0B1220]/90 backdrop-blur-md border-b border-slate-800/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-slate-100" />
            </div>
            <span className="font-semibold text-sm text-slate-100 tracking-tight">
              ShieldSight <span className="text-slate-400 font-normal text-xs">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-xs text-slate-400 hover:text-slate-100 transition-colors">
              Features
            </Link>
            <Link href="#privacy" className="text-xs text-slate-400 hover:text-slate-100 transition-colors">
              Privacy
            </Link>
            <Link href="#faq" className="text-xs text-slate-400 hover:text-slate-100 transition-colors">
              FAQ
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/harshit-911/ShieldSight.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
            <Link
              href="#download"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 text-xs font-semibold transition-all active:scale-[0.98]"
            >
              <Download className="w-3 h-3" />
              Download
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-6 border-t border-slate-800/40 mt-3 flex flex-col gap-3">
            <Link
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs text-slate-300 hover:text-white py-1"
            >
              Features
            </Link>
            <Link
              href="#privacy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs text-slate-300 hover:text-white py-1"
            >
              Privacy
            </Link>
            <Link
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs text-slate-300 hover:text-white py-1"
            >
              FAQ
            </Link>
            <Link
              href="#download"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-950 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              Download Extension
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
