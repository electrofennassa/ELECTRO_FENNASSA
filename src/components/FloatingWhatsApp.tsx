import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { lang, currentPage } = useApp();

  // Hide on admin page if needed
  if (currentPage === 'admin' || currentPage === 'admin-login') return null;

  const defaultMsg =
    lang === 'ar'
      ? 'السلام عليكم ELECTRO_FENNASSA، أود الحصول على معلومات حول منتجاتكم.'
      : 'Bonjour ELECTRO_FENNASSA, je souhaite obtenir des informations sur vos produits.';

  const waUrl = `https://wa.me/212665657310?text=${encodeURIComponent(defaultMsg)}`;

  const tooltipText =
    lang === 'ar'
      ? 'تواصل معنا مباشرة عبر واتساب'
      : 'Contactez-nous sur WhatsApp';

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2 items-end">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="WhatsApp ELECTRO_FENNASSA"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>
        <span className="hidden sm:inline font-medium text-sm pr-1">
          {lang === 'ar' ? 'واتساب' : 'WhatsApp'}
        </span>

        {/* Hover tooltip */}
        <div className="absolute right-0 bottom-full mb-3 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-slate-800">
          {tooltipText}
        </div>
      </a>
    </div>
  );
};
