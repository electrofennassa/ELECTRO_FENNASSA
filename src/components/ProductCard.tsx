import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { createWhatsAppProductMessage } from '../data/companyInfo';
import { ShoppingBag, MessageCircle, Shield, Eye, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { lang, t, addToCart, setSelectedProduct, setCurrentPage, toggleWishlist, isInWishlist } = useApp();

  const isFav = isInWishlist(product.id);

  const discountPercent = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const waLink = createWhatsAppProductMessage(
    product.name[lang],
    product.reference,
    product.price,
    undefined,
    lang
  );

  const handleOpenDetail = () => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-50 cursor-pointer" onClick={handleOpenDetail}>
        <img
          src={product.image1 || product.mainImage || product.images?.[0] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'}
          alt={product.name[lang]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Promo / Badge tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isPromo && (
            <span className="bg-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              -{discountPercent}% PROMO
            </span>
          )}
          {product.badge && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {product.badge[lang]}
            </span>
          )}
        </div>

        {/* Brand Tag & Wishlist Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-xs border shadow-xs transition-all ${
              isFav
                ? 'bg-rose-500 text-white border-rose-600 scale-110'
                : 'bg-white/90 text-slate-600 hover:text-rose-600 border-slate-200 hover:scale-105'
            }`}
            title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
          </button>
          <div className="bg-white/90 backdrop-blur-xs text-slate-900 text-[11px] font-black px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs uppercase">
            {product.brand}
          </div>
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{t.viewProduct}</span>
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] font-mono font-medium text-slate-400 block uppercase">
            {t.ref}: {product.reference}
          </span>
          <h3
            onClick={handleOpenDetail}
            className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors mt-0.5"
            title={product.name[lang]}
          >
            {product.name[lang]}
          </h3>
        </div>

        {/* Warranty and Specs snippet */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
            <Shield className="w-3 h-3 text-blue-600" />
            {product.warranty}
          </span>
          {product.power && (
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
              {product.power}
            </span>
          )}
        </div>

        {/* Price Section */}
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900">
                {product.price.toLocaleString('fr-FR')} <span className="text-xs font-semibold">DH</span>
              </span>
              {product.oldPrice && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {product.oldPrice.toLocaleString('fr-FR')} DH
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => addToCart(product, 1)}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-2 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="truncate">{t.addToCart}</span>
          </button>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs py-2.5 px-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 active:scale-95"
            title={t.orderOnWhatsApp}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 shrink-0" />
            <span className="truncate">{t.whatsappFast}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
