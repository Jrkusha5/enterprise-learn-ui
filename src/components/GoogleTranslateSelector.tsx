import React, { useEffect, useState } from 'react';
import { Languages, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const GoogleTranslateSelector: React.FC<{ className?: string; variant?: 'dark' | 'light' }> = ({
  className = '',
  variant = 'dark',
}) => {
  const [activeLang, setActiveLang] = useState<string>(() => {
    if (typeof document === 'undefined') return 'en';
    const cookie = document.cookie.match(/googtrans=([^;]+)/);
    if (cookie && cookie[1] === '/en/am') return 'am';
    return 'en';
  });

  useEffect(() => {
    const checkCookie = () => {
      const cookie = document.cookie.match(/googtrans=([^;]+)/);
      if (cookie && cookie[1] === '/en/am') setActiveLang('am');
      else setActiveLang('en');
    };
    const interval = setInterval(checkCookie, 300);
    return () => clearInterval(interval);
  }, []);

  const handleLangClick = (lang: 'en' | 'am') => {
    setActiveLang(lang);
    if (lang === 'en') {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'googtrans=; path=/; domain=' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } else {
      document.cookie = 'googtrans=/en/am; path=/';
    }
    window.location.reload();
  };

  const isDark = variant === 'dark';
  const triggerCls = isDark
    ? 'text-gray-300 hover:text-white hover:bg-white/10'
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`p-2 rounded-lg transition-colors ${triggerCls} ${className}`}
          title="Translate"
          aria-label="Select language"
        >
          <Languages className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem onClick={() => handleLangClick('en')} className="cursor-pointer gap-2">
          <span className="w-4 flex justify-center">
            {activeLang === 'en' && <Check className="h-4 w-4 text-indigo-600" />}
          </span>
          English (EN)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLangClick('am')} className="cursor-pointer gap-2">
          <span className="w-4 flex justify-center">
            {activeLang === 'am' && <Check className="h-4 w-4 text-indigo-600" />}
          </span>
          Amharic (AM)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
