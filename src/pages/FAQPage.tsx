import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { HelpCircle, ChevronDown, Phone, MessageCircle, MapPin } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { lang, t } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qFr: "Où se trouve le magasin ELECTRO_FENNASSA ?",
      qAr: "أين يقع محل ELECTRO_FENNASSA؟",
      aFr: "Notre magasin se trouve à Taourirt : BD LA RÉSISTANCE HAY JDID, Taourirt, Maroc.",
      aAr: "يقع محلنا بمدينة تاوريرت: شارع المقاومة حي جديد، تاوريرت، المغرب.",
    },
    {
      qFr: "Quels sont vos horaires d ouverture ?",
      qAr: "ما هي أوقات العمل في المحل؟",
      aFr: "Du Lundi au Dimanche de 09h00 à 21h00 (Vendredi de 14h30 à 21h00).",
      aAr: "من الاثنين إلى الأحد من 09:00 إلى 21:00 (يوم الجمعة من 14:30 إلى 21:00).",
    },
    {
      qFr: "Livrez-vous en dehors de la ville de Taourirt ?",
      qAr: "هل توفرون التوصيل خارج مدينة تاوريرت؟",
      aFr: "Non, la livraison est actuellement réservée exclusivement à la ville de Taourirt et ses quartiers environnants.",
      aAr: "لا، التوصيل حالياً حصري ومتاح فقط داخل مدينة تاوريرت وجميع أحيائها.",
    },
    {
      qFr: "Comment passer une commande sur le site ?",
      qAr: "كيف يمكنني تقديم طلب عبر الموقع؟",
      aFr: "Vous pouvez commander directement en ajoutant vos articles au panier puis en validant votre commande, ou directement en cliquant sur 'Commander sur WhatsApp' ou en appelant le 0665657310.",
      aAr: "يمكنكم الطلب مباشرة عبر إضافة المنتجات للسلة وتأكيد الطلب، أو بالضغط على 'الطلب عبر الواتساب' أو الاتصال بالرقم 0665657310.",
    },
    {
      qFr: "Quels sont les modes de paiement disponibles ?",
      qAr: "ما هي وسائل الدفع المتاحة؟",
      aFr: "Le paiement s effectue exclusivement en espèces à la livraison lors de la réception de vos appareils à votre domicile.",
      aAr: "الدفع يتم حصرياً نقداً عند الاستلام بعد معاينة أجهزتكم ببيتكم.",
    },
    {
      qFr: "Les produits sont-ils sous garantie ?",
      qAr: "هل المنتجات مصحوبة بضمان؟",
      aFr: "Oui, tous nos appareils d électroménager sont 100% neufs, d origine et couverts par une garantie officielle du fabricant ou du magasin.",
      aAr: "نعم، جميع أجهزتنا الكهرومنزلية جديدة وأصلية 100% ومرفقة بضمان رسمي.",
    },
    {
      qFr: "Comment contacter le service client d ELECTRO_FENNASSA ?",
      qAr: "كيف يمكنني التواصل مع خدمة الزبناء؟",
      aFr: "Par téléphone au 0665657310, par WhatsApp au +212665657310 ou par email à Electro_Fennassa@proton.me.",
      aAr: "عبر الهاتف على 0665657310، عبر الواتساب على +212665657310 أو البريد الإلكتروني Electro_Fennassa@proton.me.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
          <HelpCircle className="w-4 h-4" />
          <span>{lang === 'ar' ? 'مركز المساعدة' : 'Foire Aux Questions'}</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          {lang === 'ar' ? 'الأسئلة الشائعة والإجابات' : 'Questions Fréquemment Posées'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          {lang === 'ar'
            ? 'اعثر على إجابات سريعة لجميع استفساراتكم حول المنتجات والتوصيل والضمان بتاوريرت.'
            : 'Trouvez rapidement des réponses à toutes vos interrogations sur nos appareils, la livraison à Taourirt et les garanties.'}
        </p>
      </div>

      {/* Accordion list */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const q = lang === 'ar' ? faq.qAr : faq.qFr;
          const a = lang === 'ar' ? faq.aAr : faq.aFr;

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
              >
                <span>{q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Footer */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl text-center space-y-4">
        <h3 className="font-black text-lg">
          {lang === 'ar' ? 'لم تجد إجابة لسؤالك؟' : 'Vous n avez pas trouvé votre réponse ?'}
        </h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          {lang === 'ar'
            ? 'فريقنا في خدمتكم بتاوريرت للإجابة المباشرة عبر الهاتف أو الواتساب.'
            : 'Notre équipe à Taourirt est à votre disposition par téléphone ou WhatsApp.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={`tel:${COMPANY_INFO.phone.raw}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>0665657310</span>
          </a>

          <a
            href={COMPANY_INFO.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp (+212665657310)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
