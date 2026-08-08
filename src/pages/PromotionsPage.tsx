import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const PromotionsPage: React.FC = () => {
  const { lang, t, products, setCurrentPage } = useApp();

  const promoProducts = products.filter(
    (p) => p.isActive && (p.isPromotion || p.isPromo || (p.discountPercentage && p.discountPercentage > 0) || (p.oldPrice && p.oldPrice > p.price))
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-rose-500 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>OFFRES SPÉCIALES TAOURIRT</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            {t.promotions}
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            {lang === 'ar'
              ? 'تخفيضات استثنائية على أفضل الأجهزة المنزلية الكبيرة والصغيرة لدى ELECTRO_FENNASSA.'
              : 'Profitez de remises immédiates sur nos réfrigérateurs, machines à laver, robots de cuisine et climatiseurs.'}
          </p>
        </div>
      </div>

      {/* Grid */}
      {promoProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <p className="text-slate-500 text-sm">
            Aucune promotion disponible en ce moment.
          </p>
        </div>
      )}

      {/* Packs banner CTA */}
      <div className="bg-amber-50 rounded-3xl p-8 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-amber-950">
            {lang === 'ar' ? 'هل تبحث عن باقات تجهيز كاملة؟' : 'Vous préparez un mariage ou un emménagement ?'}
          </h3>
          <p className="text-xs text-amber-800 mt-1">
            {lang === 'ar'
              ? 'اكتشف باقاتنا الاقتصادية التي تجمع عدة أجهزة بسعر مالي ممتاز.'
              : 'Découvrez nos packs d équipement complets avec des réductions cumulées.'}
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('packs')}
          className="bg-amber-600 hover:bg-amber-500 text-white font-black text-xs px-6 py-3.5 rounded-2xl shadow-md transition-colors shrink-0 flex items-center gap-2"
        >
          <span>{t.viewPacks}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
