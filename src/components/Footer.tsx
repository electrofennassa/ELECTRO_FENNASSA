import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { PageRoute } from '../types';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  Truck,
  CheckCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t, setCurrentPage } = useApp();

  const handleNav = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-slate-800 text-center sm:text-left">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">
                {lang === 'ar' ? 'التوصيل لجميع أحياء تاوريرت' : 'Livraison à Taourirt'}
              </h4>
              <p className="text-xs text-slate-400">
                {COMPANY_INFO.deliveryZone[lang]}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">
                {lang === 'ar' ? 'ضمان وأصالة الأجهزة' : 'Garantie & Produit d origine'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'جميع المنتجات مضمونة مع خدمة ما بعد البيع في تاوريرت'
                  : 'Tous nos appareils sont sous garantie officielle avec SAV local.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
            <div className="p-3 bg-amber-600/20 text-amber-400 rounded-xl shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-1">
                {lang === 'ar' ? 'الدفع عند الاستلام والمعاينة' : 'Paiement à la livraison'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'افحص أجهزتك عند وصولها قبل الدفع نقداً'
                  : 'Vérifiez vos appareils à la réception avant de régler en espèces.'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          {/* Col 1: Store Branding & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                EF
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                ELECTRO<span className="text-blue-500">_FENNASSA</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {COMPANY_INFO.tagline[lang]}
            </p>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar' ? COMPANY_INFO.address.fullAr : COMPANY_INFO.address.full}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone.raw}`} dir="ltr" className="hover:text-white font-semibold">
                  {COMPANY_INFO.phone.display}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={COMPANY_INFO.whatsapp.link} target="_blank" rel="noopener noreferrer" dir="ltr" className="hover:text-emerald-400 font-semibold">
                  {COMPANY_INFO.whatsapp.display}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>

            <a
              href={COMPANY_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-950/60 border border-blue-800 px-3 py-2 rounded-xl transition-colors mt-2"
            >
              <span>{t.googleMapsCTA}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Col 2: Navigation Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              {lang === 'ar' ? 'أقسام المتجر' : 'Catégories'}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('gros-electromenager')}
                  className="hover:text-blue-400 transition-colors"
                >
                  {t.grosElectromenager}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('petit-electromenager')}
                  className="hover:text-blue-400 transition-colors"
                >
                  {t.petitElectromenager}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('promotions')}
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{t.promotions}</span>
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-bold rounded">
                    PROMO
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('packs')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>{t.packs}</span>
                  <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[9px] font-bold rounded">
                    PACKS
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('marques')}
                  className="hover:text-blue-400 transition-colors"
                >
                  {t.marques}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Information & Legal */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              {t.information}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-blue-400 transition-colors">
                  {t.about}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('faq')} className="hover:text-blue-400 transition-colors">
                  {lang === 'ar' ? 'الأسئلة الشائعة FAQ' : 'FAQ'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('wishlist')} className="hover:text-rose-400 transition-colors">
                  {lang === 'ar' ? 'المفضلة' : 'Mes Favoris'}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('delivery')} className="hover:text-blue-400 transition-colors">
                  {t.deliveryInfo}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('warranty')} className="hover:text-blue-400 transition-colors">
                  {t.warrantyInfo}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-blue-400 transition-colors">
                  {t.contact}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-blue-400 transition-colors">
                  {t.terms}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-blue-400 transition-colors">
                  {t.privacy}
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('returns')} className="hover:text-blue-400 transition-colors">
                  {t.returns}
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <button onClick={() => handleNav('admin')} className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Espace Administration</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Schedule */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{t.hoursLabel}</span>
            </h3>
            <ul className="space-y-1.5 text-xs">
              {COMPANY_INFO.schedule.map((item, idx) => (
                <li key={idx} className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="font-semibold text-slate-300">
                    {lang === 'ar' ? item.dayAr : item.dayFr}
                  </span>
                  <span className="text-slate-400">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center sm:flex sm:justify-between sm:text-left text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} ELECTRO_FENNASSA. {t.copyright}
          </p>
          <p className="mt-2 sm:mt-0 font-medium text-slate-400">
            {lang === 'ar' ? 'تاوريرت - المغرب' : 'Taourirt, Maroc'}
          </p>
        </div>
      </div>
    </footer>
  );
};
