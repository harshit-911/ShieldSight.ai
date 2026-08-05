'use client';

import { useState, useEffect } from 'react';
import { Download, Github, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { fetchLatestRelease, GitHubReleaseInfo } from '../services/githubRelease';
import { analyticsService } from '../services/analytics';

interface DownloadButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  showSubtext?: boolean;
}

export function DownloadButton({
  className = '',
  variant = 'primary',
  showSubtext = false,
}: DownloadButtonProps) {
  const [releaseInfo, setReleaseInfo] = useState<GitHubReleaseInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchLatestRelease().then((info) => {
      setReleaseInfo(info);
      setIsLoading(false);
    });
  }, []);

  const handleDownloadClick = (e: React.MouseEvent) => {
    if (!releaseInfo) return;

    if (releaseInfo.hasRelease) {
      // Release is available: trigger direct asset download & track analytics
      analyticsService.trackDownload(releaseInfo.version, 'website_button');
      window.location.href = releaseInfo.downloadUrl;
    } else {
      // Beta fallback: open friendly release modal
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const handleDevDownload = () => {
    if (releaseInfo) {
      analyticsService.trackDownload(releaseInfo.version, 'development_zip');
      window.location.href = releaseInfo.devZipUrl;
    }
  };

  const baseStyle =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-xs transition-all active:scale-[0.98] cursor-pointer';

  const variantStyles = {
    primary: 'bg-slate-100 hover:bg-white text-slate-950 px-5 py-2.5 shadow-sm',
    secondary: 'bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 shadow-sm',
    outline: 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 px-4 py-2',
  };

  if (isLoading) {
    return (
      <div className={`${baseStyle} ${variantStyles[variant]} opacity-70 ${className}`}>
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>Checking Releases...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={handleDownloadClick}
          className={`${baseStyle} ${variantStyles[variant]} ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>{releaseInfo?.hasRelease ? 'Download Extension' : 'Get ShieldSight AI'}</span>
        </button>

        {showSubtext && releaseInfo && (
          <span className="text-[11px] text-slate-400 font-mono">
            {releaseInfo.hasRelease ? `Release ${releaseInfo.version}` : 'Version 1.0.0 Beta'}
          </span>
        )}
      </div>

      {/* Beta / Development Release Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0D1322] border border-slate-800 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <AlertCircle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-100">
                ShieldSight AI Beta
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                ShieldSight AI is currently in beta. You can download the latest development build directly from GitHub.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Functional Development Build</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Includes all multimodal vision models, Hinglish profanity normalization, and WhatsApp Web chat protection.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleDevDownload}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-white text-slate-950 text-xs font-semibold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download Development Version (.ZIP)
              </button>

              <a
                href={releaseInfo?.repoUrl || 'https://github.com/harshit-911/ShieldSight.ai'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                View GitHub Repository
              </a>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
