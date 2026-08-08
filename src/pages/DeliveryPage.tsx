import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { Truck, MapPin, Clock, ShieldCheck, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';

export const DeliveryPage: React.FC = () => {
  const { lang, t } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            <Truck className="w-4 h-4" />
            <span>{lang === 'ar' ? 'توصيل حصري بمدينة تاوريرت' : 'Livraison Exclusive à Taourirt'}</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            {lang === 'ar'
              ? 'توصيل سريع وآمن لأجهزتكم الكهرومنزلية حتى باب المنزل'
              : 'Livraison Rapide et Sécurisée de vos Électroménagers à Domicile'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'ar'
              ? 'تضمن لكم ELECTRO_FENNASSA توصيلاً موثوقاً وسريعاً لجميع الأجهزة الكهرومنزلية الكبيرة والصغيرة داخل مدينة تاوريرت مع إمكانية المعاينة قبل الدفع.'
              : 'ELECTRO_FENNASSA assure la livraison fiable et rapide de tous vos appareils ménagers à Taourirt, avec paiement en espèces uniquement à la réception.'}
          </p>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-base">
            {lang === 'ar' ? 'منطقة التوصيل' : 'Zone Exclusives'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'ar'
              ? 'نغطي جميع أحياء مدينة تاوريرت (حي الجديد، الحي الإداري، النهضة، القدس، مولاي علي الشريف، وغيرها).'
              : 'Nous couvrons l ensemble des quartiers de Taourirt (Hay Jdid, Quartier Administratif, Al Qods, Ennahda, etc.).'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-base">
            {lang === 'ar' ? 'آجال التوصيل' : 'Délais de Livraison'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'ar'
              ? 'توصيل في نفس اليوم أو خلال 24 ساعة كأقصى حد بعد تأكيد طلبكم هاتفياً أو عبر الواتساب.'
              : 'Livraison le jour même ou sous 24h maximum après confirmation de votre commande par téléphone ou WhatsApp.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-black text-slate-900 text-base">
            {lang === 'ar' ? 'الدفع عند الاستلام' : 'Paiement à la Livraison'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'ar'
              ? 'لا تسددون أي مبلغ حتى تتسلموا أجهزتكم وتفحصوا سلامتها الضمانية والتقنية.'
              : 'Aucun prépaiement requis. Vous contrôlez votre appareil à la réception avant de régler en espèces.'}
          </p>
        </div>
      </div>

      {/* Conditions Details */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
          {lang === 'ar' ? 'شروط وإجراءات التسليم' : 'Modalités et Informations Pratiques'}
        </h2>

        <div className="space-y-4 text-xs text-slate-700">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 text-sm mb-0.5">
                {lang === 'ar' ? 'التأكيد الهاتفي قبل الانطلاق' : 'Confirmation Téléphonique'}
              </strong>
              <p className="text-slate-600">
                {lang === 'ar'
                  ? 'يتصل بكم فريقنا قبل التوجه إلى عنوانكم للتأكد من تواجدكم وتحديد الموعد الأنسب.'
                  : 'Notre livreur vous appelle obligatoirement avant le déplacement pour convenir du créneau exact.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 text-sm mb-0.5">
                {lang === 'ar' ? 'معاينة الجهاز وضمان المحل' : 'Vérification et Reçu de Garantie'}
              </strong>
              <p className="text-slate-600">
                {lang === 'ar'
                  ? 'يتم تسليم الجهاز في علبته الأصلية مع وصل الشراء وبطاقة الضمان الرسمية.'
                  : 'L appareil est livré dans son emballage d origine scellé avec le bon de garantie officiel ELECTRO_FENNASSA.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl font-black">
          {lang === 'ar' ? 'هل لديك سؤال حول التوصيل؟' : 'Une question sur la livraison à Taourirt ?'}
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          {lang === 'ar'
            ? 'تواصلوا مباشرة مع فريقنا بتاوريرت للإجابة عن جميع استفساراتكم.'
            : 'Contactez notre équipe magasin pour toute demande de renseignement ou précision.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={`tel:${COMPANY_INFO.phone.raw}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>0665657310</span>
          </a>

          <a
            href={COMPANY_INFO.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp (+212665657310)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
