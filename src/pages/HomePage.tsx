import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { CATEGORIES } from '../data/categories';
import { INITIAL_BRANDS } from '../data/brands';
import { ProductCard } from '../components/ProductCard';
import { PackCard } from '../components/PackCard';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  PhoneCall,
  Clock,
  Sparkles,
  Award,
  CheckCircle,
  MapPin,
  MessageCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { lang, t, products, packs, brands, setCurrentPage, setSelectedCategoryFilter } = useApp();

  const promoProducts = products.filter((p) => p.isPromo || p.isPromotion).slice(0, 4);
  const featuredPacks = packs.slice(0, 3);
  const activeBrands = brands.length > 0 ? brands : INITIAL_BRANDS;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl mx-4 sm:mx-0">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80"
            alt="Électroménager Taourirt"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-20 lg:py-24 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-600/30 border border-blue-500/40 px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>
                {lang === 'ar' ? 'متجركم في تاوريرت' : 'Magasin spécialisé à Taourirt'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              {t.heroTitle}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentPage('catalog')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>{t.exploreCatalog}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage('promotions')}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95"
              >
                {t.viewPromotions}
              </button>

              <button
                onClick={() => setCurrentPage('packs')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold text-sm px-6 py-3.5 rounded-2xl transition-all active:scale-95"
              >
                {t.viewPacks}
              </button>
            </div>

            {/* Local Delivery Tag */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 pt-3">
              <Truck className="w-4 h-4" />
              <span>{COMPANY_INFO.deliveryZone[lang]}</span>
            </div>
          </div>

          {/* Quick Highlights Box */}
          <div className="hidden lg:block bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-black text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>
                {lang === 'ar' ? 'مميزات ELECTRO_FENNASSA' : 'Les Garanties Electro Fennassa'}
              </span>
            </h3>

            <div className="space-y-3 text-xs text-slate-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">
                    {lang === 'ar' ? 'توصيل سريع بمدينة تاوريرت' : 'Livraison rapide à Taourirt'}
                  </p>
                  <p className="text-slate-300">
                    {lang === 'ar'
                      ? 'توصيل مباشر إلى منزلك بجميع أحياء تاوريرت'
                      : 'Livraison sur mesure jusqu à votre domicile.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">
                    {lang === 'ar' ? 'الدفع نقداً عند الاستلام والمعاينة' : 'Paiement à la livraison'}
                  </p>
                  <p className="text-slate-300">
                    {lang === 'ar'
                      ? 'افحص أجهزتك وتأكد منها قبل تسليم المبلغ'
                      : 'Réglez en toute confiance lors de la réception.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">
                    {lang === 'ar' ? 'ضمان أصلي وخدمة ما بعد البيع' : 'Garantie officielle & SAV'}
                  </p>
                  <p className="text-slate-300">
                    {lang === 'ar'
                      ? 'متابعة وخدمة صيانة محلية بمتجرنا شارع المقاومة'
                      : 'Un service après-vente réactif directement à Taourirt.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t.popularCategories}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'ar'
                ? 'تصفح أقسام الأجهزة المنزلية الكبيرة والصغيرة'
                : 'Explorez nos deux grands univers d équipement.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategoryFilter(cat.id);
                setCurrentPage(cat.id as any);
              }}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200"
            >
              <img
                src={cat.image}
                alt={cat.title[lang]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800 px-3 py-1 rounded-full inline-block">
                  {cat.subcategories.length}{' '}
                  {lang === 'ar' ? 'أنواع فرعية' : 'sous-catégories'}
                </span>
                <h3 className="text-2xl font-black">{cat.title[lang]}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {cat.description[lang]}
                </p>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>{t.exploreCatalog}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotions Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              {t.promotions}
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              {t.promotionsSpotlight}
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('promotions')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>{lang === 'ar' ? 'عرض الكل' : 'Voir tout'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Packs Section */}
      <section className="bg-slate-900 text-white py-12 rounded-3xl mx-4 sm:mx-0 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-black uppercase text-amber-400 bg-amber-950/80 border border-amber-800 px-3.5 py-1.5 rounded-full">
                PACKS D ÉQUIPEMENT
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight mt-3">
                {t.featuredPacksTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {t.featuredPacksSub}
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('packs')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg transition-colors flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>{t.viewPacks}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-900">
            {featuredPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </div>
      </section>

      {/* Brands Bar */}
      <section className="max-w-7xl mx-auto px-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-6">
          {lang === 'ar' ? 'ماركات عالمية متوفرة لدينا' : 'Grandes Marques Partenaires'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {activeBrands.map((brand, idx) => (
            <div
              key={brand.id || idx}
              onClick={() => setCurrentPage('marques')}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition-all cursor-pointer text-center font-black text-slate-800 text-base flex items-center justify-center gap-2"
            >
              <span>{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Store Location & Call Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full">
              TAOURIRT • MAGASIN PHYSIQUE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              {lang === 'ar' ? 'تفضلوا بزيارة متجرنا في تاوريرت' : 'Rendez-nous visite à Taourirt'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {COMPANY_INFO.address.full}
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-slate-900 font-bold text-xs px-5 py-3 rounded-xl shadow hover:bg-slate-100 transition-colors flex items-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>{t.googleMapsCTA}</span>
              </a>

              <a
                href={`tel:${COMPANY_INFO.phone.raw}`}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span dir="ltr">{COMPANY_INFO.phone.display}</span>
              </a>
            </div>
          </div>

          {/* Schedule Summary */}
          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl space-y-2 text-xs">
            <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{t.hoursLabel}</span>
            </h4>
            <p className="text-slate-300">
              Lundi - Jeudi, Samedi, Dimanche : <strong className="text-white">09h00 - 21h00</strong>
            </p>
            <p className="text-slate-300">
              Vendredi : <strong className="text-white">14h30 - 21h00</strong>
            </p>
            <p className="text-emerald-400 font-semibold pt-2">
              ✓ Service de livraison rapide sur Taourirt
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
