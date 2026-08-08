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

  const [formData, setFormData] = useState<OrderCustomer>({
    fullName: '',
    phone: '',
    city: 'Taourirt',
    address: '',
    email: '',
    notes: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  /*
   * Validation du numéro marocain.
   * Accepte notamment :
   * 0665657310
   * 06 65 65 73 10
   * +212665657310
   * +212 665657310
   * 00212665657310
   */
  const validateMoroccanPhone = (phone: string) => {
    const cleaned = phone.replace(/[\s\-.\(\)]/g, '');
    const pattern = /^(?:\+212|00212|0)[567]\d{8}$/;

    return pattern.test(cleaned);
  };

  /*
   * Mise à jour centralisée des champs.
   * Cette méthode évite les problèmes de réinitialisation
   * de l'état pendant la saisie sur mobile.
   */
  const updateField = (
    field: keyof OrderCustomer,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];

      return next;
    });
  };

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      errs.fullName =
        lang === 'ar'
          ? 'يرجى إدخال الاسم الكامل'
          : 'Le nom et prénom sont obligatoires.';
    }

    if (!formData.phone.trim()) {
      errs.phone =
        lang === 'ar'
          ? 'يرجى إدخال رقم الهاتف'
          : 'Le numéro de téléphone est obligatoire.';
    } else if (!validateMoroccanPhone(formData.phone)) {
      errs.phone =
        lang === 'ar'
          ? 'يرجى إدخال رقم هاتف مغربي صحيح (مثال: 0665657310)'
          : 'Numéro de téléphone marocain valide requis (ex: 06 65 65 73 10).';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: { [key: string]: string } = {};

    const cityTrimmed = formData.city.trim().toLowerCase();

    if (
      cityTrimmed !== 'taourirt' &&
      cityTrimmed !== 'تاوريرت'
    ) {
      errs.city =
        lang === 'ar'
          ? 'في الوقت الحالي، التوصيل متوفر فقط داخل مدينة تاوريرت.'
          : 'Pour le moment, la livraison est disponible uniquement à Taourirt.';
    }

    if (!formData.address.trim()) {
      errs.address =
        lang === 'ar'
          ? 'يرجى إدخال العنوان المفصل بمدينة تاوريرت'
          : "L'adresse exacte à Taourirt est obligatoire.";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleNextStep1 = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleNextStep2 = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleFinalSubmit = async () => {
    const step1Valid = validateStep1();
    const step2Valid = validateStep2();

    if (!step1Valid || !step2Valid) {
      addToast(
        lang === 'ar'
          ? 'يرجى التحقق من صحة البيانات'
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
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Erreur lors de la validation de la commande';

      addToast(message, 'warning');
    } finally {
      setSubmitting(false);
    }
  };

  const deliveryFeeDisplay = () => {
    if (deliveryConfig.type === 'free') {
      return (
        <span className="font-bold text-emerald-600">
          {t.freeTaourirtDelivery}
        </span>
      );
    }

    if (
      deliveryConfig.type === 'fixed' &&
      deliveryConfig.fee > 0
    ) {
      return (
        <span className="font-bold text-slate-900">
          {deliveryConfig.fee} DH
        </span>
      );
    }

    return (
      <span className="font-semibold text-amber-700">
        {lang === 'ar'
          ? 'يتم تأكيده بعد الطلب'
          : 'À confirmer'}
      </span>
    );
  };

  const grandTotal =
    deliveryConfig.type === 'fixed'
      ? cartTotal + deliveryConfig.fee
      : cartTotal;

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <ShoppingBag className="w-16 h-16 stroke-1 mx-auto text-slate-300" />

        <h2 className="text-2xl font-black text-slate-900">
          {t.cartEmpty}
        </h2>

        <p className="text-xs text-slate-500">
          Veuillez ajouter des appareils à votre panier avant de procéder au checkout.
        </p>

        <button
          type="button"
          onClick={() => setCurrentPage('catalog')}
          className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
        >
          {t.exploreCatalog}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Titre */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          {t.checkoutTitle}
        </h1>

        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>{t.checkoutSubtitle}</span>
        </p>
      </div>

      {/* Barre de progression */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold">
          
          {/* Étape 1 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 ${
              currentStep === 1
                ? 'text-blue-600 font-black'
                : currentStep > 1
                ? 'text-emerald-600'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                currentStep === 1
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : currentStep > 1
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </span>

            <span className="hidden sm:inline">
              {lang === 'ar' ? '1. المشتري' : '1. Client'}
            </span>
          </button>

          <div
            className={`flex-1 h-1 mx-3 rounded-full transition-colors ${
              currentStep > 1
                ? 'bg-emerald-500'
                : 'bg-slate-200'
            }`}
          />

          {/* Étape 2 */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) {
                setCurrentStep(2);
              }
            }}
            className={`flex items-center gap-2 ${
              currentStep === 2
                ? 'text-blue-600 font-black'
                : currentStep > 2
                ? 'text-emerald-600'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                currentStep === 2
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
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
            className={`flex-1 h-1 mx-3 rounded-full transition-colors ${
              currentStep > 2
                ? 'bg-emerald-500'
                : 'bg-slate-200'
            }`}
          />

          {/* Étape 3 */}
          <button
            type="button"
            onClick={() => {
              if (
                validateStep1() &&
                validateStep2()
              ) {
                setCurrentStep(3);
              }
            }}
            className={`flex items-center gap-2 ${
              currentStep === 3
                ? 'text-blue-600 font-black'
                : 'text-slate-400'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                currentStep === 3
                  ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>

            <span className="hidden sm:inline">
              {lang === 'ar'
                ? '3. التأكيد'
                : '3. Confirmation'}
            </span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Formulaire */}
        <div className="md:col-span-7 space-y-6">

          {/* =========================
              ÉTAPE 1 : CLIENT
          ========================== */}
          {currentStep === 1 && (
            <form
              onSubmit={handleNextStep1}
              noValidate
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5"
            >
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />

                <span>
                  {lang === 'ar'
                    ? 'الخطوة 1: معلومات المشتري'
                    : 'Étape 1 : Coordonnées du client'}
                </span>
              </h3>

              {/* NOM COMPLET */}
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
                  autoCapitalize="words"
                  spellCheck={false}
                  dir="auto"
                  value={formData.fullName}
                  onChange={(e) =>
                    updateField('fullName', e.target.value)
                  }
                  placeholder="Ex : Mohamed Amine"
                  className={`w-full bg-slate-50 text-slate-900 text-base sm:text-xs px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.fullName
                      ? 'border-rose-500 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />

                {errors.fullName && (
                  <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* TÉLÉPHONE */}
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
                  dir="ltr"
                  value={formData.phone}
                  onChange={(e) =>
                    updateField('phone', e.target.value)
                  }
                  placeholder="06 65 65 73 10"
                  className={`w-full bg-slate-50 text-slate-900 text-base sm:text-xs px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.phone
                      ? 'border-rose-500 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />

                <span className="text-[10px] text-slate-500 mt-1 block">
                  {lang === 'ar'
                    ? 'صيغة الرقم المغربي: 0665657310 أو +212665657310'
                    : 'Format Marocain : 0665657310 ou +212665657310'}
                </span>

                {errors.phone && (
                  <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                    {errors.phone}
                  </span>
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
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  dir="ltr"
                  value={formData.email || ''}
                  onChange={(e) =>
                    updateField('email', e.target.value)
                  }
                  placeholder="Ex : client@email.com"
                  className="w-full bg-slate-50 text-slate-900 text-base sm:text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs active:scale-95 mt-4"
              >
                <span>
                  {lang === 'ar'
                    ? 'المتابعة للتوصيل'
                    : "Continuer vers l'adresse de livraison"}
                </span>

                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* =========================
              ÉTAPE 2 : LIVRAISON
          ========================== */}
          {currentStep === 2 && (
            <form
              onSubmit={handleNextStep2}
              noValidate
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5"
            >
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />

                <span>
                  {lang === 'ar'
                    ? 'الخطوة 2: عنوان التوصيل بتاوريرت'
                    : 'Étape 2 : Adresse de livraison à Taourirt'}
                </span>
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
                  autoComplete="address-level2"
                  value={formData.city}
                  readOnly
                  className={`w-full bg-emerald-50 text-emerald-950 font-bold text-xs px-4 py-3 rounded-xl border ${
                    errors.city
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-emerald-200'
                  }`}
                />

                <span className="text-[11px] text-emerald-700 font-medium mt-1 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />

                  {lang === 'ar'
                    ? 'التوصيل متوفر حصرياً لجميع أحياء مدينة تاوريرت'
                    : 'Livraison à domicile disponible exclusivement à Taourirt.'}
                </span>

                {errors.city && (
                  <span className="text-[11px] text-rose-600 font-bold mt-1 block">
                    {errors.city}
                  </span>
                )}
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
                  rows={3}
                  autoComplete="street-address"
                  dir="auto"
                  value={formData.address}
                  onChange={(e) =>
                    updateField('address', e.target.value)
                  }
                  placeholder="Ex : Quartier Hay Jdid, Rue 12, N° 45, Taourirt"
                  className={`w-full bg-slate-50 text-slate-900 text-base sm:text-xs p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                    errors.address
                      ? 'border-rose-500 bg-rose-50/20'
                      : 'border-slate-200 focus:border-blue-600'
                  }`}
                />

                {errors.address && (
                  <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                    {errors.address}
                  </span>
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
                  autoComplete="off"
                  dir="auto"
                  value={formData.notes || ''}
                  onChange={(e) =>
                    updateField('notes', e.target.value)
                  }
                  placeholder="Ex : Merci d'appeler avant la livraison"
                  className="w-full bg-slate-50 text-slate-900 text-base sm:text-xs px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-3 rounded-2xl transition-colors text-xs flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />

                  <span>
                    {lang === 'ar'
                      ? 'السابق'
                      : 'Précédent'}
                  </span>
                </button>

                <button
                  type="submit"
                  className="w-2/3 bg-slate-900 hover:bg-blue-600 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs active:scale-95"
                >
                  <span>
                    {lang === 'ar'
                      ? 'المتابعة للتأكيد'
                      : 'Voir le résumé de commande'}
                  </span>

                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* =========================
              ÉTAPE 3 : CONFIRMATION
          ========================== */}
          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />

                <span>
                  {lang === 'ar'
                    ? 'الخطوة 3: تأكيد الطلب النهائي'
                    : 'Étape 3 : Confirmation finale de votre commande'}
                </span>
              </h3>

              {/* RÉCAPITULATIF */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">
                    {formData.fullName}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-blue-600 hover:underline font-bold text-[11px]"
                  >
                    Modifier
                  </button>
                </div>

                <p className="text-slate-600 font-mono">
                  📱 Téléphone : {formData.phone}
                </p>

                <p className="text-slate-600">
                  📍 Adresse : {formData.address}, Taourirt
                </p>

                {formData.email && (
                  <p className="text-slate-500">
                    ✉️ Email : {formData.email}
                  </p>
                )}

                {formData.notes && (
                  <p className="text-slate-500 italic">
                    📝 Note : {formData.notes}
                  </p>
                )}
              </div>

              {/* PAIEMENT */}
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-950 text-xs space-y-1">
                <p className="font-black text-emerald-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />

                  <span>
                    Mode de paiement : Paiement en espèces à la livraison
                  </span>
                </p>

                <p className="text-emerald-800 text-[11px]">
                  Le règlement s'effectue auprès de notre livreur à la réception de vos appareils à Taourirt.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-3 rounded-2xl transition-colors text-xs flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />

                  <span>
                    {lang === 'ar'
                      ? 'تعديل العنوان'
                      : 'Précédent'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-xs active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span>Enregistrement...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />

                      <span>{t.confirmOrderCTA}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            RÉSUMÉ COMMANDE
        ========================== */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              {t.orderSummary} (
              {cart.length} article
              {cart.length > 1 ? 's' : ''}
              )
            </h3>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto space-y-2 pr-1">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="pt-2 flex items-center gap-3"
                >
                  <img
                    src={item.product.mainImage}
                    alt={item.product.name[lang]}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-slate-900 truncate">
                      {item.product.name[lang]}
                    </p>

                    <p className="text-slate-500">
                      Réf : {item.product.reference}
                    </p>

                    <p className="text-slate-500 font-medium">
                      Qté : {item.quantity} ×{' '}
                      {item.product.price.toLocaleString(
                        'fr-FR'
                      )}{' '}
                      DH
                    </p>
                  </div>

                  <span className="text-xs font-black text-slate-900">
                    {(
                      item.product.price *
                      item.quantity
                    ).toLocaleString('fr-FR')}{' '}
                    DH
                  </span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>

                <span className="font-semibold text-slate-900">
                  {cartTotal.toLocaleString('fr-FR')} DH
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{t.deliveryCost}</span>

                {deliveryFeeDisplay()}
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>{t.total}</span>

                <span className="text-blue-700 text-lg">
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
