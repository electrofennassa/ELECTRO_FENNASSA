import React from 'react';
import { useApp } from '../context/AppContext';
import { createWhatsAppProductMessage } from '../data/companyInfo';
import {
  ShoppingBag,
  MessageCircle,
  Package,
  ArrowLeft,
  CheckCircle2,
  Tag,
  CreditCard,
  Shield,
  Truck,
} from 'lucide-react';

export const PackDetailPage: React.FC = () => {
  const { lang, t, selectedPack, setCurrentPage, addPackToCart, setSelectedProduct } = useApp();

  if (!selectedPack) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          {lang === 'ar' ? 'لم يتم تحديد أي باقة' : 'Aucun pack sélectionné'}
        </h2>
        <button
          onClick={() => setCurrentPage('packs')}
          className="bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
        >
          {t.viewPacks}
        </button>
      </div>
    );
  }

  const pack = selectedPack;
  const normalPrice = pack.normalPrice || pack.oldPrice || 0;
  const packPrice = pack.packPrice || pack.price || 0;
  const savings = pack.savings || (normalPrice > packPrice ? normalPrice - packPrice : 0);

  const waLink = createWhatsAppProductMessage(
    `Pack: ${pack.name[lang] || pack.name.fr}`,
    pack.reference || pack.id,
    packPrice,
    lang
  );

  const handleBuyNow = () => {
    addPackToCart(pack);
    setCurrentPage('checkout');
  };

  return (
    <div className="space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => setCurrentPage('packs')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'ar' ? 'العودة لقائمة الباقات' : 'Retour aux packs'}</span>
        </button>
      </div>

      {/* Main Pack Header Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2 space-y-4 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {pack.badge ? pack.badge[lang] : 'OFFRE SPÉCIALE PACK'}
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Réf: {pack.reference || pack.id}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight">
            {pack.name[lang] || pack.name.fr}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {pack.description[lang] || pack.description.fr}
          </p>

          <div className="pt-2 flex items-baseline gap-4">
            <div>
              <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'سعر الباقة الإجمالي' : 'Prix Pack'}</span>
              <span className="text-3xl font-black text-white">
                {packPrice.toLocaleString('fr-FR')} <span className="text-base">DH</span>
              </span>
            </div>
            {normalPrice > packPrice && (
              <div>
                <span className="text-xs text-slate-400 block">{lang === 'ar' ? 'السعر العادي' : 'Prix normal'}</span>
                <span className="text-lg font-bold text-slate-400 line-through">
                  {normalPrice.toLocaleString('fr-FR')} DH
                </span>
              </div>
            )}
            {savings > 0 && (
              <span className="bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
                Économie {savings.toLocaleString('fr-FR')} DH
              </span>
            )}
          </div>
        </div>

        <div className="aspect-4/3 rounded-2xl overflow-hidden bg-white/10 border border-white/20">
          <img
            src={pack.image}
            alt={pack.name[lang] || pack.name.fr}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Included Products Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span>{lang === 'ar' ? 'الأجهزة المضمنة في هذه الباقة' : 'Produits inclus dans ce pack'}</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {pack.products?.length || 0} appareils
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(pack.products || []).map((prod, idx) => (
            <div
              key={prod.id || idx}
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-4 hover:bg-slate-100/80 transition-colors"
            >
              <img
                src={prod.mainImage}
                alt={prod.name[lang] || prod.name.fr}
                className="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  {prod.brand}
                </span>
                <h3 className="text-xs font-bold text-slate-900 truncate">
                  {prod.name[lang] || prod.name.fr}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">Réf: {prod.reference}</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xs font-black text-slate-900">
                    {prod.price.toLocaleString('fr-FR')} DH
                  </span>
                  {prod.warranty && (
                    <span className="text-[10px] text-slate-500">({prod.warranty})</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(prod);
                  setCurrentPage('product-detail');
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 shrink-0 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
              >
                Voir
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => addPackToCart(pack)}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black text-sm py-4 px-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>{lang === 'ar' ? 'إضافة الباقة للسلة' : 'Ajouter le pack au panier'}</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-4 px-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>{lang === 'ar' ? 'طلب الباقة مباشرة' : 'Commander le pack'}</span>
          </button>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-4 px-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>WhatsApp (+212665657310)</span>
          </a>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2 flex-wrap">
          <span className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-emerald-600" /> Livraison rapide à Taourirt
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-blue-600" /> Garantie officielle sur tous les appareils
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-amber-500" /> Paiement à la livraison
          </span>
        </div>
      </div>
    </div>
  );
};
