import React from 'react';
import { useApp } from '../context/AppContext';
import { PackCard } from '../components/PackCard';
import { Package, Sparkles } from 'lucide-react';

export const PacksPage: React.FC = () => {
  const { lang, t, packs } = useApp();

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>PACKS ÉQUIPEMENT TAOURIRT</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            {t.packs}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'باقات تجهيز المطبخ، العرسان والشقق بأسعار ممتازة وتوصيل مباشر لجميع أحياء تاوريرت.'
              : 'Regroupez vos achats d électroménager en un seul pack et profitez d d économies substantielles avec livraison gratuite à Taourirt.'}
          </p>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packs.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
        ))}
      </div>
    </div>
  );
};
