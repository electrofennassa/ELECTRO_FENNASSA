import React from 'react';
import { Pack } from '../types';
import { useApp } from '../context/AppContext';
import { createWhatsAppPackMessage } from '../data/companyInfo';
import { Package, Check, MessageCircle, ArrowRight, Eye } from 'lucide-react';

interface PackCardProps {
  pack: Pack;
}

export const PackCard: React.FC<PackCardProps> = ({ pack }) => {
  const { lang, t, addPackToCart, setSelectedPack, setCurrentPage } = useApp();

  const normalPrice = pack.normalPrice || pack.oldPrice || 0;
  const packPrice = pack.packPrice || pack.price || 0;
  const savings = pack.savings || (normalPrice > packPrice ? normalPrice - packPrice : 0);

  const waLink = createWhatsAppPackMessage(
    pack.name[lang] || pack.name.fr,
    pack.reference || pack.id,
    packPrice,
    lang
  );

  const handleOpenDetail = () => {
    setSelectedPack(pack);
    setCurrentPage('pack-detail');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Header Pack Image */}
        <div
          onClick={handleOpenDetail}
          className="relative h-52 bg-slate-100 overflow-hidden cursor-pointer"
        >
          <img
            src={pack.image}
            alt={pack.name[lang] || pack.name.fr}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

          {/* Badge */}
          <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg">
            {pack.badge ? pack.badge[lang] : 'PACK ÉCONOMIQUE'}
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400">
              {pack.reference || pack.id}
            </span>
            <h3 className="text-lg font-black leading-snug">{pack.name[lang] || pack.name.fr}</h3>
          </div>
        </div>

        {/* Included Items List */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {pack.description[lang] || pack.description.fr}
          </p>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-blue-600" />
                <span>{lang === 'ar' ? 'الأجهزة المضمنة:' : 'Inclus dans ce pack :'}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold">
                ({pack.products?.length || 0} éléments)
              </span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {(pack.products || []).slice(0, 4).map((p, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-semibold truncate">{p.name[lang] || p.name.fr}</span>
                </li>
              ))}
              {(pack.products?.length || 0) > 4 && (
                <li className="text-[11px] text-blue-600 font-bold pt-0.5">
                  + {(pack.products?.length || 0) - 4} autres appareils...
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Price & CTAs */}
      <div className="p-5 pt-0 border-t border-slate-100 mt-2 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">
              {lang === 'ar' ? 'سعر الباقة:' : 'Prix du pack :'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {packPrice.toLocaleString('fr-FR')} <span className="text-sm font-bold">DH</span>
              </span>
              {normalPrice > packPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {normalPrice.toLocaleString('fr-FR')} DH
                </span>
              )}
            </div>
          </div>
          {savings > 0 && (
            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                {lang === 'ar'
                  ? `توفير ${savings.toLocaleString('fr-FR')} درهم`
                  : `Économie ${savings.toLocaleString('fr-FR')} DH`}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleOpenDetail}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs py-3 px-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.viewPack}</span>
          </button>
          <button
            onClick={() => addPackToCart(pack)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 px-3 rounded-xl shadow-xs transition-colors"
          >
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};
