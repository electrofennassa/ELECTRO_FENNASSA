import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { lang, t, wishlist, products, setCurrentPage } = useApp();

  const favoriteProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => setCurrentPage('catalog')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'ar' ? 'العودة للكتالوج' : 'Retour au catalogue'}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-600 fill-rose-600" />
            <span>{lang === 'ar' ? 'المنتجات المفضلة' : 'Mes Produits Favoris'}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ar'
              ? `لديك ${favoriteProducts.length} منتج محفوظ في قائمة المفضلة`
              : `Vous avez ${favoriteProducts.length} produit(s) enregistré(s) dans vos favoris.`}
          </p>
        </div>
      </div>

      {/* Grid or Empty state */}
      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xs text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
            <Heart className="w-8 h-8 stroke-1" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {lang === 'ar' ? 'قائمة المفضلة فارغة' : 'Votre liste de favoris est vide'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {lang === 'ar'
              ? 'انقر على أيقونة القلب على أي منتج لحفظه والعودة إليه لاحقاً.'
              : 'Cliquez sur le cœur d un appareil pour le sauvegarder dans vos favoris et le retrouver facilement.'}
          </p>
          <button
            onClick={() => setCurrentPage('catalog')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.exploreCatalog}</span>
          </button>
        </div>
      )}
    </div>
  );
};
