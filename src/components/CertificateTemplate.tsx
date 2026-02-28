import React from 'react';
import { Award } from 'lucide-react';

interface CertificateTemplateProps {
  recipientName: string;
  courseTitle: string;
  completionDate?: string;
  platformName?: string;
  className?: string;
  /** Ref for the certificate container - used for PDF capture */
  certificateRef?: React.RefObject<HTMLDivElement | null>;
}

const CornerOrnament = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-amber-500/60">
    <path d="M0 0 L48 0 L48 8 L8 8 L8 48 L0 48 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M0 0 L16 0 L16 16 L0 16 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
  </svg>
);

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  recipientName,
  courseTitle,
  completionDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  platformName = 'EduFlow Learning Platform',
  className = '',
  certificateRef,
}) => (
  <div
    ref={certificateRef}
    className={`certificate-pdf-capture bg-gradient-to-br from-amber-50 via-white to-amber-50/50 ${className}`}
    style={{ width: 520, minHeight: 720 }}
  >
    {/* Ornate multi-layer border frame */}
    <div className="relative p-[6px] border-[4px] border-amber-400/70 rounded-md shadow-lg">
      <div className="relative p-[4px] border-2 border-amber-500/50 rounded">
        <div className="relative p-[3px] border border-amber-600/30 rounded bg-white">
          {/* Inner content area */}
          <div className="relative p-8 md:p-12 bg-gradient-to-b from-white to-amber-50/30 rounded min-h-[680px]">
            {/* Decorative corner ornaments */}
            <div className="absolute top-3 left-3">
              <CornerOrnament />
            </div>
            <div className="absolute top-3 right-3 rotate-90">
              <CornerOrnament />
            </div>
            <div className="absolute bottom-3 left-3 -rotate-90">
              <CornerOrnament />
            </div>
            <div className="absolute bottom-3 right-3 rotate-180">
              <CornerOrnament />
            </div>

            {/* Top ornamental divider */}
            <div className="absolute top-16 left-8 right-8 flex items-center gap-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
              <div className="w-2 h-2 rotate-45 bg-amber-500/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
            </div>

            {/* Main content */}
            <div className="text-center relative z-10 pt-12">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center border-4 border-amber-400/60 shadow-xl ring-4 ring-amber-200/50">
                <Award className="w-12 h-12 text-amber-700" />
              </div>

              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-600 mb-3">
                Certificate of Completion
              </p>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-px bg-amber-400/60" />
                <div className="w-2 h-2 rotate-45 bg-amber-500/50" />
                <div className="w-12 h-px bg-amber-400/60" />
              </div>

              <p className="text-slate-600 text-sm mb-6 font-medium tracking-wide">
                This is to certify that
              </p>
              <p className="text-3xl font-bold text-slate-800 mb-8 px-6 font-serif tracking-wide border-b-2 border-amber-400/50 pb-4 inline-block">
                {recipientName}
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-16 h-px bg-amber-400/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                <div className="w-16 h-px bg-amber-400/50" />
              </div>

              <p className="text-slate-600 text-sm mb-4 font-medium tracking-wide">
                has successfully completed the course
              </p>
              <p className="text-xl font-bold text-indigo-700 mb-10 px-6 leading-tight max-w-md mx-auto">
                {courseTitle}
              </p>

              <div className="inline-block px-8 py-3 border-2 border-amber-400/40 rounded-lg mb-8 bg-amber-50/50">
                <p className="text-xs text-slate-600 font-semibold tracking-wide">
                  {completionDate}
                </p>
              </div>

              <p className="text-sm font-bold text-slate-700 tracking-widest uppercase">
                {platformName}
              </p>
            </div>

            {/* Bottom ornamental divider */}
            <div className="absolute bottom-16 left-8 right-8 flex items-center gap-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
              <div className="w-2 h-2 rotate-45 bg-amber-500/50" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
