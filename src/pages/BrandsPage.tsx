import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Award, CheckCircle2 } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  const { lang, t, products, brands, selectedBrandFilter, setSelectedBrandFilter } = useApp();

  const handleSelectBrand = (brandName: string) => {
    setSelectedBrandFilter(brandName);
  };

  const activeBrands = brands.filter((b) => b.isActive);

  const activeProducts = selectedBrandFilter === 'all'
    ? products
    : products.filter((p) => p.brand.toLowerCase() === selectedBrandFilter.toLowerCase() || p.brandId === selectedBrandFilter);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>MARQUES INTERNATIONALES</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            {t.marques}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'تصفح منتجات أشهر العلامات العالمية المتوفرة بمتجر ELECTRO_FENNASSA في تاوريرت.'
              : 'Retrouvez vos marques préférées : Samsung, Bosch, LG, Whirlpool, Moulinex, Tefal, Carrier...'}
          </p>
        </div>
      </div>

      {/* Brand Selector Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {lang === 'ar' ? 'اختر علامة تجارية:' : 'Sélectionnez une marque :'}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedBrandFilter('all')}
            className={`p-3 rounded-2xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
              selectedBrandFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>{t.allBrands}</span>
            <span className="text-[10px] opacity-80">({products.length})</span>
          </button>

          {activeBrands.map((b) => {
            const count = products.filter(
              (p) => p.brand.toLowerCase() === b.name.toLowerCase() || p.brandId === b.id
            ).length;
            const isSelected = selectedBrandFilter.toLowerCase() === b.name.toLowerCase() || selectedBrandFilter === b.id;

            return (
              <button
                key={b.id || b.name}
                onClick={() => handleSelectBrand(b.name)}
                className={`p-3 rounded-2xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 text-center ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{b.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {count} produit(s)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
          <h2 className="text-xl font-black text-slate-900">
            {selectedBrandFilter === 'all'
              ? 'Tous nos produits'
              : `Produits de la marque ${selectedBrandFilter}`}
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {activeProducts.length} article(s) trouvé(s)
          </span>
        </div>

        {activeProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm">
              Aucun produit disponible pour cette marque pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
