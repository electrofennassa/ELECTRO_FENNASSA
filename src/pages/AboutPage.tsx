import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { ShieldCheck, Truck, Award, MapPin, CheckCircle2, Clock, Phone, MessageCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang, t, setCurrentPage } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-3">
        <span className="text-xs font-bold text-amber-400 bg-amber-950 border border-amber-800 px-3 py-1 rounded-full uppercase">
          TAOURIRT • MAROC
        </span>
        <h1 className="text-3xl sm:text-5xl font-black">
          À propos de ELECTRO_FENNASSA
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          {COMPANY_INFO.tagline[lang]}
        </p>
      </div>

      {/* Story */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm">
        <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
          {lang === 'ar' ? 'من نحن؟' : 'Notre Histoire & Notre Engagement à Taourirt'}
        </h2>

        <p>
          Situé à <strong>BD LA RÉSISTANCE HAY JDID, Taourirt</strong>, ELECTRO_FENNASSA est le magasin de référence spécialisé dans la vente d appareils d électroménager gros et petit matériel pour la maison.
        </p>

        <p>
          Nous nous engageons à offrir à notre clientèle de Taourirt les meilleures marques internationales (Samsung, Bosch, LG, Whirlpool, Moulinex, Tefal, Carrier...) aux prix les plus compétitifs, accompagnés d un service de livraison rapide et d un accompagnement après-vente personnalisé.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-xs">Produits Garantis</h4>
            <p className="text-[11px] text-slate-500">Garantie officielle constructeur et suivi en magasin.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <Truck className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-slate-900 text-xs">Livraison Taourirt</h4>
            <p className="text-[11px] text-slate-500">Livraison à domicile sur toute la ville de Taourirt.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h4 className="font-bold text-slate-900 text-xs">Conseil Spécialisé</h4>
            <p className="text-[11px] text-slate-500">Orientation sur mesure pour vos équipements et packs.</p>
          </div>
        </div>

        {/* Location & Hours Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Coordonnées & Localisation</span>
            </h3>
            <p className="text-slate-600">
              <strong>Adresse :</strong> BD LA RÉSISTANCE HAY JDID, Taourirt, Maroc
            </p>
            <p className="text-slate-600">
              <strong>Téléphone :</strong> <a href={`tel:${COMPANY_INFO.phone.raw}`} className="text-blue-600 font-bold hover:underline">0665657310</a>
            </p>
            <p className="text-slate-600">
              <strong>Email :</strong> Electro_Fennassa@proton.me
            </p>
            <a
              href={COMPANY_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors mt-2"
            >
              <MapPin className="w-4 h-4" />
              <span>📍 Nous trouver sur Google Maps</span>
            </a>
          </div>

          <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Horaires d ouverture</span>
            </h3>
            <ul className="space-y-1 text-slate-600">
              <li className="flex justify-between py-1 border-b border-slate-200">
                <span>Lundi - Jeudi :</span>
                <span className="font-bold">09h00 - 21h00</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-200">
                <span>Vendredi :</span>
                <span className="font-bold text-blue-600">14h30 - 21h00</span>
              </li>
              <li className="flex justify-between py-1">
                <span>Samedi - Dimanche :</span>
                <span className="font-bold">09h00 - 21h00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
