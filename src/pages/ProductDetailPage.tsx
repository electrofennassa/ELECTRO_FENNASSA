import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { createWhatsAppProductMessage, COMPANY_INFO } from '../data/companyInfo';
import { handleImageError } from '../utils/imageUtils';
import {
  ShoppingBag,
  MessageCircle,
  Shield,
  Truck,
  ArrowLeft,
  CheckCircle2,
  ZoomIn,
  X,
  CreditCard,
  Zap,
  Phone,
  Heart,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    lang,
    t,
    selectedProduct,
    setCurrentPage,
    addToCart,
    products,
    setSelectedProduct,
    addRecentlyViewed,
    toggleWishlist,
    isInWishlist,
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      addRecentlyViewed(selectedProduct.id);
    }
  }, [selectedProduct?.id]);

  if (!selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">
          {lang === 'ar' ? 'لم يتم تحديد أي منتج' : 'Aucun produit sélectionné'}
        </h2>
        <button
          onClick={() => setCurrentPage('catalog')}
          className="bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
        >
          {t.exploreCatalog}
        </button>
      </div>
    );
  }

  const p = selectedProduct;
  const isFav = isInWishlist(p.id);
  const rawList = [
    p.image1,
    p.image2,
    p.image3,
    ...(p.images || []),
    p.mainImage,
  ].filter((img): img is string => Boolean(img && img.trim()));
  const allImages = Array.from(new Set(rawList));
  if (allImages.length === 0) {
    allImages.push('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80');
  }
  const activeImage = allImages[activeImageIndex] || allImages[0];

  const discountPercent = p.oldPrice && p.oldPrice > p.price
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : p.discountPercentage || 0;

  const productUrl = `${window.location.origin}/#product-${p.id}`;

  const waLink = createWhatsAppProductMessage(
    p.name[lang] || p.name.fr,
    p.reference,
    p.price,
    productUrl,
    lang
  );

  const handleBuyNow = () => {
    addToCart(p, 1);
    setCurrentPage('checkout');
  };

  // Structured Data JSON-LD for Google SEO
  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: p.name.fr,
    image: [p.mainImage, ...allImages],
    description: p.description.fr,
    sku: p.reference,
    mpn: p.reference,
    brand: {
      '@type': 'Brand',
      name: p.brand,
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'MAD',
      price: p.price,
      itemCondition: p.isNew ? 'https://schema.org/NewCondition' : 'https://schema.org/RefurbishedCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ELECTRO_FENNASSA',
      },
    },
  };

  // Related products from same category or brand, excluding current product
  const relatedProducts = products
    .filter(
      (item) =>
        item.id !== p.id &&
        item.isActive &&
        (item.categoryId === p.categoryId || item.category === p.category || item.brand === p.brand)
    )
    .slice(0, 4);

  return (
    <div className="space-y-12 pb-20">
      {/* Back button */}
      <div>
        <button
          onClick={() => setCurrentPage('catalog')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'ar' ? 'العودة للكتالوج' : 'Retour au catalogue'}</span>
        </button>
      </div>

      {/* Main Product Hero Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Gallery */}
        <div className="space-y-4">
          {/* Active Image Box */}
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 group">
            <img
              src={activeImage}
              alt={p.name[lang] || p.name.fr}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={() => setIsZoomOpen(true)}
              onError={handleImageError}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {(p.isPromotion || p.isPromo || discountPercent > 0) && (
                <span className="bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                  -{discountPercent}% PROMO
                </span>
              )}
              {p.isNew && (
                <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-xs uppercase">
                  NOUVEAU
                </span>
              )}
            </div>

            {/* Brand badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-black px-3 py-1 rounded-xl border border-slate-200 shadow-xs uppercase">
              {p.brand}
            </div>

            {/* Zoom hint */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-xl backdrop-blur-xs transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ZoomIn className="w-4 h-4" />
              <span className="hidden sm:inline">Agrandir</span>
            </button>
          </div>

          {/* Thumbnails list */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {allImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 ${
                    activeImageIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-100 shadow-md'
                      : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{t.ref}: <strong className="text-slate-800">{p.reference}</strong></span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-sans font-semibold">
                {p.brand}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {p.name[lang] || p.name.fr}
            </h1>

            {/* Price Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">
                  {lang === 'ar' ? 'السعر كاش' : 'Prix TTC'}
                </span>
                <div className="flex items-baseline gap-3 mt-0.5">
                  <span className="text-3xl font-black text-slate-900">
                    {p.price.toLocaleString('fr-FR')} <span className="text-base font-bold">DH</span>
                  </span>
                  {p.oldPrice && p.oldPrice > p.price && (
                    <span className="text-base font-semibold text-slate-400 line-through">
                      {p.oldPrice.toLocaleString('fr-FR')} DH
                    </span>
                  )}
                </div>
              </div>

              {discountPercent > 0 && (
                <span className="bg-rose-100 text-rose-700 font-extrabold text-xs px-3 py-1 rounded-full">
                  Économie de {((p.oldPrice || 0) - p.price).toLocaleString('fr-FR')} DH
                </span>
              )}
            </div>

            {/* Quick Specs highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 block">{t.warranty}</span>
                  <span className="text-slate-600">{p.warranty}</span>
                </div>
              </div>

              {p.power && (
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">{t.power}</span>
                    <span className="text-slate-600">{p.power}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-xs text-slate-600 leading-relaxed space-y-1 pt-2">
              <span className="font-bold text-slate-900 text-sm block">{t.description} :</span>
              <p>{p.description[lang] || p.description.fr}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => addToCart(p, 1)}
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>{lang === 'ar' ? 'طلب مباشر الآن' : 'Commander maintenant'}</span>
              </button>
            </div>

            {/* Official WhatsApp & Call Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600 shrink-0" />
                <span>{lang === 'ar' ? 'الطلب عبر الواتساب' : 'Commander sur WhatsApp'}</span>
              </a>

              <a
                href={`tel:${COMPANY_INFO.phone.raw}`}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>{lang === 'ar' ? 'الاتصال بـ ELECTRO_FENNASSA' : 'Appeler ELECTRO_FENNASSA'}</span>
              </a>
            </div>

            {/* Guarantee and Taourirt local delivery assurance */}
            <div className="pt-2 text-[11px] text-slate-500 space-y-1.5">
              <p className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.fastLocalDelivery}</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{t.guaranteeNotice}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Section */}
      {((p.technicalSpecifications && p.technicalSpecifications.length > 0) ||
        (p.specifications && p.specifications.length > 0) ||
        p.dimensions ||
        p.color) && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>{t.technicalSpecs}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
            {p.dimensions && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">{t.dimensions}</span>
                <span className="font-bold text-slate-900">{p.dimensions}</span>
              </div>
            )}
            {p.color && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">{t.color}</span>
                <span className="font-bold text-slate-900">{p.color[lang] || p.color.fr}</span>
              </div>
            )}
            {(p.technicalSpecifications || p.specifications || []).map((spec, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-500">
                  {spec.label[lang] || spec.label.fr}
                </span>
                <span className="font-bold text-slate-900">
                  {spec.value[lang] || spec.value.fr}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products Section ("Vous pourriez également aimer") */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-slate-900">
              {t.relatedProducts}
            </h2>
            <button
              onClick={() => setCurrentPage('catalog')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              {lang === 'ar' ? 'عرض الكل' : 'Voir tout le catalogue'} →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-slate-300 p-2 bg-slate-800 rounded-full"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white p-2">
            <img
              src={activeImage}
              alt={p.name[lang] || p.name.fr}
              className="w-full h-full object-contain max-h-[80vh]"
              onError={handleImageError}
            />
          </div>
        </div>
      )}
    </div>
  );
};
