export const COMPANY_INFO = {
  name: 'ELECTRO_FENNASSA',
  tagline: {
    fr: "Votre magasin spécialisé en électroménager à Taourirt",
    ar: "متجركم المتخصص في الأجهزة المنزلية بتاوريرت",
  },
  address: {
    street: 'BD LA RÉSISTANCE HAY JDID',
    city: 'Taourirt',
    country: 'Maroc',
    full: 'BD LA RÉSISTANCE HAY JDID, Taourirt, Maroc',
    fullAr: 'شارع المقاومة حي الجديد، تاوريرت، المغرب',
  },
  phone: {
    display: '06 65 65 73 10',
    raw: '0665657310',
    int: '+212665657310',
  },
  whatsapp: {
    number: '+212665657310',
    display: '06 65 65 73 10',
    link: 'https://wa.me/212665657310',
  },
  email: 'Electro_Fennassa@proton.me',
  googleMapsUrl: 'https://maps.app.goo.gl/wUPfRPxePRANYL4y9',
  deliveryZone: {
    fr: 'Livraison à domicile disponible uniquement sur la ville de Taourirt',
    ar: 'التوصيل المنزلي متوفر فقط داخل مدينة تاوريرت',
  },
  schedule: [
    { dayFr: 'Lundi', dayAr: 'الإثنين', hours: '09h00 - 21h00' },
    { dayFr: 'Mardi', dayAr: 'الثلاثاء', hours: '09h00 - 21h00' },
    { dayFr: 'Mercredi', dayAr: 'الأربعاء', hours: '09h00 - 21h00' },
    { dayFr: 'Jeudi', dayAr: 'الخميس', hours: '09h00 - 21h00' },
    { dayFr: 'Vendredi', dayAr: 'الجمعة', hours: '14h30 - 21h00' },
    { dayFr: 'Samedi', dayAr: 'السبت', hours: '09h00 - 21h00' },
    { dayFr: 'Dimanche', dayAr: 'الأحد', hours: '09h00 - 21h00' },
  ],
  socials: {
    facebook: null,
    instagram: null,
    tiktok: null,
  },
};

export function createWhatsAppProductMessage(
  productName: string,
  reference: string,
  price: number,
  productUrl?: string,
  lang: 'fr' | 'ar' = 'fr'
): string {
  const url = productUrl || window.location.href;
  if (lang === 'ar') {
    const text = `السلام عليكم ELECTRO_FENNASSA، أنا مهتم بالمنتج التالي:

المنتج: ${productName}
المرجع: ${reference}
الثمن: ${price.toLocaleString('fr-FR')} درهم

الرابط: ${url}`;
    return `https://wa.me/212665657310?text=${encodeURIComponent(text)}`;
  } else {
    const text = `Bonjour ELECTRO_FENNASSA, je suis intéressé par :

Produit : ${productName}
Référence : ${reference}
Prix : ${price.toLocaleString('fr-FR')} DH

Lien : ${url}`;
    return `https://wa.me/212665657310?text=${encodeURIComponent(text)}`;
  }
}

export function createWhatsAppPackMessage(
  packName: string,
  reference: string,
  price: number,
  lang: 'fr' | 'ar' = 'fr'
): string {
  const url = window.location.href;
  if (lang === 'ar') {
    const text = `السلام عليكم ELECTRO_FENNASSA، أنا مهتم بالباقة التالية:

الباقة: ${packName}
المرجع: ${reference}
الثمن: ${price.toLocaleString('fr-FR')} درهم

الرابط: ${url}`;
    return `https://wa.me/212665657310?text=${encodeURIComponent(text)}`;
  } else {
    const text = `Bonjour ELECTRO_FENNASSA, je suis intéressé par :

Produit : ${packName}
Référence : ${reference}
Prix : ${price.toLocaleString('fr-FR')} DH

Lien : ${url}`;
    return `https://wa.me/212665657310?text=${encodeURIComponent(text)}`;
  }
}

export function createWhatsAppOrderMessage(
  orderNumber: string,
  customerName: string,
  customerPhone: string,
  total: number,
  lang: 'fr' | 'ar' = 'fr'
): string {
  if (lang === 'ar') {
    const text = `السلام عليكم ELECTRO_FENNASSA،

لقد قمت بطلب جديد.

رقم الطلب: ${orderNumber}
الاسم: ${customerName}
الهاتف: ${customerPhone}
المجموع: ${total.toLocaleString('fr-FR')} درهم

شكرا.`;
    return `https://wa.me/212665657310?text=${encodeURIComponent(text)}`;
  } else {
    const text = `Bonjour ELECTRO_FENNASSA,

Je viens de passer une commande.

Numéro : ${orderNumber}
Nom : ${customerName}
Téléphone : ${customerPhone}
Total : ${total.toLocaleString('fr-FR')} DH

Merci.`;
    return `https://wa.me/212665657310?text=${encodeURIComponent(text)}`;
  }
}
