import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { CheckCircle, MessageCircle, Home, FileText, Printer, MapPin, Phone } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { lang, t, currentOrder, setCurrentPage } = useApp();

  if (!currentOrder) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <p className="text-slate-500 font-bold">Aucune commande récente à afficher.</p>
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-full"
        >
          {t.backToHome}
        </button>
      </div>
    );
  }

  const orderNum = currentOrder.orderNumber || `#${currentOrder.id}`;
  const totalFormatted = currentOrder.totalAmount || currentOrder.total || 0;

  let waText = '';
  if (lang === 'ar') {
    waText = `السلام عليكم ELECTRO_FENNASSA، لقد قمت بطلب جديد برقم ${orderNum}. اسمي هو ${currentOrder.customer.fullName} والمجموع هو ${totalFormatted.toLocaleString('fr-FR')} درهم.`;
  } else {
    waText = `Bonjour ELECTRO_FENNASSA, je viens de passer la commande ${orderNum}. Mon nom est ${currentOrder.customer.fullName} et le total est de ${totalFormatted.toLocaleString('fr-FR')} DH.`;
  }

  const waLink = `https://wa.me/212665657310?text=${encodeURIComponent(waText)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Success Banner */}
      <div className="bg-emerald-600 text-white rounded-3xl p-8 text-center space-y-3 shadow-xl print:hidden">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto text-white mb-2">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">{t.orderConfirmedTitle}</h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
          {t.thankYouMessage}
        </p>

        {/* Order Number Pill */}
        <div className="inline-block bg-slate-900 text-white text-xs font-mono font-bold px-4 py-2 rounded-full border border-emerald-400/30">
          N° Commande: {orderNum}
        </div>
      </div>

      {/* WhatsApp Immediate Action Box */}
      <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 text-center space-y-4 print:hidden">
        <div className="space-y-1">
          <h3 className="font-black text-amber-950 text-lg">
            {lang === 'ar' ? 'تأكيد سريع عبر واتساب' : 'Confirmation rapide sur WhatsApp'}
          </h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto">
            {t.whatsAppConfirmInstruction}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Contacter ELECTRO_FENNASSA sur WhatsApp</span>
          </a>

          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95"
          >
            <Printer className="w-5 h-5" />
            <span>Imprimer le Bon de Commande</span>
          </button>
        </div>
      </div>

      {/* Printable Bon de Commande Document */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Printable Header Header for Company */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              ELECTRO_FENNASSA
            </h2>
            <p className="text-xs text-slate-500">{COMPANY_INFO.tagline[lang]}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{COMPANY_INFO.address.street}, {COMPANY_INFO.address.city}</span>
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tél / WhatsApp: {COMPANY_INFO.phone.display}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-blue-50 text-blue-900 text-xs font-mono font-bold px-3 py-1 rounded-lg border border-blue-200 mb-1">
              BON DE COMMANDE
            </span>
            <p className="text-xs font-mono font-bold text-slate-900">{orderNum}</p>
            <p className="text-xs text-slate-400">
              Date: {new Date(currentOrder.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Customer & Delivery Section */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div>
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 mb-1">
              Client
            </p>
            <p className="font-bold text-slate-900">{currentOrder.customer.fullName}</p>
            <p className="text-slate-600">📱 {currentOrder.customer.phone}</p>
            {currentOrder.customer.email && <p className="text-slate-600">✉️ {currentOrder.customer.email}</p>}
          </div>

          <div>
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400 mb-1">
              Livraison & Paiement
            </p>
            <p className="text-slate-700">📍 {currentOrder.customer.address}, Taourirt</p>
            <p className="text-emerald-700 font-bold mt-1">
              Paiement: En espèces à la livraison
            </p>
            <p className="text-blue-700 font-bold">
              Statut: {currentOrder.status}
            </p>
          </div>
        </div>

        {/* Item List Table */}
        <div className="space-y-3">
          <table className="w-full text-left text-xs divide-y divide-slate-200">
            <thead>
              <tr className="text-slate-500 font-bold uppercase text-[10px] bg-slate-100">
                <th className="py-2.5 px-3 rounded-l-lg">Article</th>
                <th className="py-2.5 px-3">Réf</th>
                <th className="py-2.5 px-3 text-center">Qté</th>
                <th className="py-2.5 px-3 text-right">Prix Unitaire</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentOrder.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {item.productName || item.name}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {item.productReference || item.reference || 'N/A'}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700">
                    {(item.unitPrice || item.price).toLocaleString('fr-FR')} DH
                  </td>
                  <td className="py-3 px-3 text-right font-black text-slate-900">
                    {((item.unitPrice || item.price) * item.quantity).toLocaleString('fr-FR')} DH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
            <span>Total Général TTC (Livraison à Taourirt)</span>
            <span className="text-blue-700 text-xl font-black">
              {totalFormatted.toLocaleString('fr-FR')} DH
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 text-center pt-4 border-t border-slate-100">
          Merci de votre confiance. Pour toute question, contactez ELECTRO_FENNASSA au 0665657310.
        </div>
      </div>

      <div className="text-center print:hidden">
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-2xl transition-colors inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>
      </div>
    </div>
  );
};
