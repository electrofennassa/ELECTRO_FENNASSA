import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderCustomer } from '../types';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  User,
  CreditCard,
  FileText,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    lang,
    t,
    cart,
    cartTotal,
    submitOrder,
    setCurrentPage,
    addToast,
    deliveryConfig,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<OrderCustomer>({
    fullName: '',
    phone: '',
    city: 'Taourirt',
    address: '',
    email: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // =========================================================
  // MODIFICATION D'UN CHAMP
  // =========================================================
  const updateField = (field: keyof OrderCustomer, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (!prev[field]) return prev;

      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // =========================================================
  // VALIDATION TELEPHONE MAROCAIN
  // =========================================================
  const validateMoroccanPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-().]/g, '');
    return /^(?:\+212|00212|0)[567]\d{8}$/.test(cleaned);
  };

  // =========================================================
  // ETAPE 1
  // =========================================================
  const validateStep1 = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName =
        lang === 'ar'
          ? 'يرجى إدخال الاسم الكامل'
          : 'Le nom et prénom sont obligatoires.';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone =
        lang === 'ar'
          ? 'يرجى إدخال رقم الهاتف'
          : 'Le numéro de téléphone est obligatoire.';
    } else if (!validateMoroccanPhone(formData.phone)) {
      nextErrors.phone =
        lang === 'ar'
          ? 'يرجى إدخال رقم هاتف مغربي صحيح'
          : 'Veuillez entrer un numéro de téléphone marocain valide.';
    }

    // Email facultatif mais vérifié s'il est rempli
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      nextErrors.email =
        lang === 'ar'
          ? 'يرجى إدخال بريد إلكتروني صحيح'
          : 'Veuillez entrer une adresse email valide.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // =========================================================
  // ETAPE 2
  // =========================================================
  const validateStep2 = () => {
    const nextErrors: Record<string, string> = {};

    const city = formData.city.trim().toLowerCase();

    if (city !== 'taourirt' && city !== 'تاوريرت') {
      nextErrors.city =
        lang === 'ar'
          ? 'التوصيل متوفر فقط داخل مدينة تاوريرت.'
          : 'La livraison est disponible uniquement à Taourirt.';
    }

    if (!formData.address.trim()) {
      nextErrors.address =
        lang === 'ar'
          ? 'يرجى إدخال العنوان الكامل'
          : "L'adresse exacte est obligatoire.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // =========================================================
  // ETAPE 1 -> 2
  // =========================================================
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  // =========================================================
  // ETAPE 2 -> 3
  // =========================================================
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  // =========================================================
  // CONFIRMATION COMMANDE
  // =========================================================
  const handleFinalSubmit = async () => {
    const validStep1 = validateStep1();
    const validStep2 = validateStep2();

    if (!validStep1 || !validStep2) {
      addToast(
        lang === 'ar'
          ? 'يرجى التحقق من المعلومات'
          : 'Veuillez vérifier les informations saisies.',
        'warning'
      );
      return;
    }

    setSubmitting(true);

    try {
      await submitOrder({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email?.trim() || '',
        city: 'Taourirt',
        address: formData.address.trim(),
        notes: formData.notes?.trim() || '',
      });
    } catch (error: any) {
      addToast(
        error?.message || 'Erreur lors de la validation de la commande.',
        'warning'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // LIVRAISON
  // =========================================================
  const deliveryFeeDisplay = () => {
    if (deliveryConfig.type === 'free') {
      return (
        <span className="font-bold text-emerald-600">
          {t.freeTaourirtDelivery}
        </span>
      );
    }

    if (deliveryConfig.type === 'fixed' && deliveryConfig.fee > 0) {
      return (
        <span className="font-bold text-slate-900">
          {deliveryConfig.fee} DH
        </span>
      );
    }

    return (
      <span className="font-semibold text-amber-700">
        {lang === 'ar' ? 'يتم تأكيده بعد الطلب' : 'À confirmer'}
      </span>
    );
  };

  const grandTotal =
    deliveryConfig.type === 'fixed'
      ? cartTotal + deliveryConfig.fee
      : cartTotal;

  // =========================================================
  // PANIER VIDE
  // =========================================================
  if (cart.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <ShoppingBag className="w-16 h-16 stroke-1 mx-auto text-slate-300" />

        <h2 className="text-2xl font-black text-slate-900">
          {t.cartEmpty}
        </h2>

        <p className="text-xs text-slate-500">
          Veuillez ajouter des appareils à votre panier avant de procéder au
          checkout.
        </p>

        <button
          type="button"
          onClick={() => setCurrentPage('catalog')}
          className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-full"
        >
          {t.exploreCatalog}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* =====================================================
          TITRE
      ===================================================== */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {t.checkoutTitle}
        </h1>

        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>{t.checkoutSubtitle}</span>
        </p>
      </div>

      {/* =====================================================
          PROGRESSION
      ===================================================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2"
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                currentStep === 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </span>

            <span className="hidden sm:inline">
              {lang === 'ar' ? '1. المشتري' : '1. Client'}
            </span>
          </button>

          <div
            className={`flex-1 h-1 mx-3 rounded-full ${
              currentStep > 1 ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          />

          <button
            type="button"
            onClick={() => {
              if (validateStep1()) {
                setCurrentStep(2);
              }
            }}
            className="flex items-center gap-2"
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                currentStep === 2
                  ? 'bg-blue-600 text-white'
                  : currentStep > 2
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep > 2 ? '✓' : '2'}
            </span>

            <span className="hidden sm:inline">
              {lang === 'ar' ? '2. التوصيل' : '2. Livraison'}
            </span>
          </button>

          <div
            className={`flex-1 h-1 mx-3 rounded-full ${
              currentStep > 2 ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          />

          <button
            type="button"
            onClick={() => {
              if (validateStep1() && validateStep2()) {
                setCurrentStep(3);
              }
            }}
            className="flex items-center gap-2"
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center ${
                currentStep === 3
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>

            <span className="hidden sm:inline">
              {lang === 'ar' ? '3. التأكيد' : '3. Confirmation'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* ===================================================
            FORMULAIRE
        =================================================== */}
        <div className="md:col-span-7">
          {/* =================================================
              ETAPE 1
          ================================================= */}
          {currentStep === 1 && (
            <form
              onSubmit={handleNextStep1}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5"
            >
              <h3 className="text-base font-black text-slate-900 border-b pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />

                {lang === 'ar'
                  ? 'الخطوة 1: معلومات المشتري'
                  : 'Étape 1 : Coordonnées du client'}
              </h3>

              {/* NOM */}
              <div>
                <label
                  htmlFor="checkout-fullName"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  {t.fullName} *
                </label>

                <input
                  id="checkout-fullName"
                  name="fullName"
                  type="text"
                  inputMode="text"
                  autoComplete="name"
                  enterKeyHint="next"
                  spellCheck={false}
                  dir="auto"
                  value={formData.fullName}
                  onFocus={(e) => e.currentTarget.select()}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Ex : Mohamed Amine"
                  className={`w-full min-h-[52px] bg-slate-50 text-slate-900 text-sm px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.fullName
                      ? 'border-rose-500'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />

                {errors.fullName && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* TELEPHONE */}
              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  {t.phone} *
                </label>

                <input
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="06 65 65 73 10"
                  dir="ltr"
                  className={`w-full min-h-[52px] bg-slate-50 text-slate-900 text-sm px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.phone
                      ? 'border-rose-500'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />

                <p className="text-[10px] text-slate-500 mt-1">
                  06 65 65 73 10 ou +212665657310
                </p>

                {errors.phone && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="checkout-email"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  {t.emailOptional}
                </label>

                <input
                  id="checkout-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  spellCheck={false}
                  autoCapitalize="none"
                  dir="ltr"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="client@email.com"
                  className={`w-full min-h-[52px] bg-slate-50 text-slate-900 text-sm px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.email
                      ? 'border-rose-500'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />

                {errors.email && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                {lang === 'ar'
                  ? 'المتابعة للتوصيل'
                  : "Continuer vers l'adresse de livraison"}

                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* =================================================
              ETAPE 2
          ================================================= */}
          {currentStep === 2 && (
            <form
              onSubmit={handleNextStep2}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5"
            >
              <h3 className="text-base font-black text-slate-900 border-b pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />

                {lang === 'ar'
                  ? 'الخطوة 2: عنوان التوصيل بتاوريرت'
                  : 'Étape 2 : Adresse de livraison à Taourirt'}
              </h3>

              {/* VILLE */}
              <div>
                <label
                  htmlFor="checkout-city"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  {t.cityLabel}
                </label>

                <input
                  id="checkout-city"
                  name="city"
                  type="text"
                  value="Taourirt"
                  readOnly
                  className="w-full bg-emerald-50 text-emerald-950 font-bold text-sm px-4 py-3.5 rounded-xl border border-emerald-200"
                />

                <p className="text-[11px] text-emerald-700 mt-1">
                  {lang === 'ar'
                    ? 'التوصيل متوفر داخل مدينة تاوريرت'
                    : 'Livraison disponible exclusivement à Taourirt.'}
                </p>
              </div>

              {/* ADRESSE */}
              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  {t.address} *
                </label>

                <textarea
                  id="checkout-address"
                  name="address"
                  rows={4}
                  inputMode="text"
                  autoComplete="street-address"
                  enterKeyHint="next"
                  dir="auto"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Ex : Hay Jdid, Rue 12, N°45, Taourirt"
                  className={`w-full min-h-[110px] bg-slate-50 text-slate-900 text-sm p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.address
                      ? 'border-rose-500'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />

                {errors.address && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    {errors.address}
                  </p>
                )}
              </div>

              {/* NOTES */}
              <div>
                <label
                  htmlFor="checkout-notes"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  {t.notesOptional}
                </label>

                <input
                  id="checkout-notes"
                  name="notes"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  enterKeyHint="done"
                  dir="auto"
                  value={formData.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Ex : Merci d'appeler avant la livraison"
                  className="w-full min-h-[52px] bg-slate-50 text-slate-900 text-sm px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </button>

                <button
                  type="submit"
                  className="w-2/3 bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  {lang === 'ar'
                    ? 'المتابعة للتأكيد'
                    : 'Voir le résumé'}

                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* =================================================
              ETAPE 3
          ================================================= */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-slate-900 border-b pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />

                {lang === 'ar'
                  ? 'الخطوة 3: تأكيد الطلب'
                  : 'Étape 3 : Confirmation de votre commande'}
              </h3>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <strong>{formData.fullName}</strong>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-600 font-bold"
                  >
                    Modifier
                  </button>
                </div>

                <p>📱 {formData.phone}</p>

                <p>
                  📍 {formData.address}, Taourirt
                </p>

                {formData.email && <p>✉️ {formData.email}</p>}

                {formData.notes && <p>📝 {formData.notes}</p>}
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <p className="font-black text-emerald-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Paiement en espèces à la livraison
                </p>

                <p className="text-[11px] text-emerald-800 mt-1">
                  Le paiement se fait auprès du livreur lors de la réception.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-1/3 bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="w-2/3 bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    'Enregistrement...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {t.confirmOrderCTA}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================
            RESUME PANIER
        =================================================== */}
        <div className="md:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-3">
              {t.orderSummary} ({cart.length})
            </h3>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="py-3 flex items-center gap-3"
                >
                  <img
                    src={item.product.mainImage}
                    alt={item.product.name[lang]}
                    className="w-12 h-12 object-cover rounded-lg border shrink-0"
                  />

                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold truncate">
                      {item.product.name[lang]}
                    </p>

                    <p className="text-slate-500">
                      Réf : {item.product.reference}
                    </p>

                    <p className="text-slate-500">
                      Qté : {item.quantity} ×{' '}
                      {item.product.price.toLocaleString('fr-FR')} DH
                    </p>
                  </div>

                  <span className="text-xs font-black">
                    {(item.product.price * item.quantity).toLocaleString(
                      'fr-FR'
                    )}{' '}
                    DH
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t space-y-2 text-xs">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <strong>
                  {cartTotal.toLocaleString('fr-FR')} DH
                </strong>
              </div>

              <div className="flex justify-between">
                <span>{t.deliveryCost}</span>
                {deliveryFeeDisplay()}
              </div>

              <div className="flex justify-between text-lg font-black pt-3 border-t">
                <span>{t.total}</span>

                <span className="text-blue-700">
                  {grandTotal.toLocaleString('fr-FR')} DH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
