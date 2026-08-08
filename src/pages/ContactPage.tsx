import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Send,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { lang, t, addToast } = useApp();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    const msg = lang === 'ar' ? 'تم إرسال رسالتكم بنجاح' : 'Votre message a bien été envoyé.';
    addToast(msg, 'success');
    setForm({ name: '', phone: '', message: '' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full uppercase">
            TAOURIRT • MAROC
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">
            {t.contactTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.contactSubtitle}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Store Coords & Schedule */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Coordonnées ELECTRO_FENNASSA
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{t.storeAddressLabel}</span>
                  <p className="text-slate-600 mt-0.5">
                    {lang === 'ar' ? COMPANY_INFO.address.fullAr : COMPANY_INFO.address.full}
                  </p>
                  <a
                    href={COMPANY_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 mt-1"
                  >
                    <span>{t.googleMapsCTA}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{t.phoneLabel} & WhatsApp</span>
                  <p dir="ltr" className="font-mono font-bold text-slate-800 text-sm mt-0.5">
                    {COMPANY_INFO.phone.display}
                  </p>
                  <a
                    href={COMPANY_INFO.whatsapp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-800 mt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Ouvrir WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{t.emailLabel}</span>
                  <p className="font-medium text-slate-700 mt-0.5">
                    {COMPANY_INFO.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>{t.hoursLabel}</span>
            </h3>
            <ul className="divide-y divide-slate-100 text-xs">
              {COMPANY_INFO.schedule.map((item, idx) => (
                <li key={idx} className="py-2 flex justify-between">
                  <span className="font-semibold text-slate-700">
                    {lang === 'ar' ? item.dayAr : item.dayFr}
                  </span>
                  <span className="font-bold text-slate-900">{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Direct Inquiry Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
            {t.sendUsMessage}
          </h3>

          <form onSubmit={handleSend} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t.fullName} *
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Mohamed Amine"
                className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {t.phone} *
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="06 65 65 73 10"
                className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Message *
              </label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Posez votre question concernant un réfrigérateur, lave-linge, climatiseur..."
                className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-3.5 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{t.sendMessageCTA}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
