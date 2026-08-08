import { Pack } from '../types';
import { INITIAL_PRODUCTS } from './products';

export const INITIAL_PACKS: Pack[] = [
  {
    id: 'pack-mariage',
    name: {
      fr: 'Pack Mariage Grand Confort (5 Éléments)',
      ar: 'باك العرسان الممتاز (5 أجهزة)',
    },
    slug: 'pack-mariage-grand-confort',
    reference: 'PACK-MARIAGE-GOLD',
    description: {
      fr: 'Le pack complet d électroménager pour équiper votre nouveau foyer à Taourirt : Réfrigérateur Samsung No Frost + Lave-linge Bosch 9kg + Cuisinière Whirlpool 5 Feux + Robot Moulinex + Friteuse Tefal Air Fryer.',
      ar: 'الباقة الكاملة للعرسان لتجهيز منزلك الجديد بتاوريرت: ثلاجة سامسونج + غسالة بوش 9 كجم + طباخة وربول 5 عيون + محضر طعام مولينكس + مقلاة تيفال بدون زيت.',
    },
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    normalPrice: 19260,
    packPrice: 17490,
    price: 17490,
    oldPrice: 19260,
    savings: 1770,
    isActive: true,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    badge: {
      fr: 'ÉCONOMISEZ 1 770 DH',
      ar: 'وفر 1 770 درهم',
    },
    packProducts: [
      { productId: 'prod-001', quantity: 1 },
      { productId: 'prod-002', quantity: 1 },
      { productId: 'prod-003', quantity: 1 },
      { productId: 'prod-008', quantity: 1 },
      { productId: 'prod-009', quantity: 1 },
    ],
    products: [
      INITIAL_PRODUCTS[0], // Samsung Fridge
      INITIAL_PRODUCTS[1], // Bosch Washer
      INITIAL_PRODUCTS[2], // Whirlpool Cooker
      INITIAL_PRODUCTS[7], // Moulinex Robot
      INITIAL_PRODUCTS[8], // Tefal Airfryer
    ],
  },
  {
    id: 'pack-cuisine',
    name: {
      fr: 'Pack Cuisine Inox Moderne',
      ar: 'باك المطبخ العصري إينوكس',
    },
    slug: 'pack-cuisine-inox-moderne',
    reference: 'PACK-CUISINE-INOX',
    description: {
      fr: 'Équipez votre cuisine avec des appareils inox assortis de marque internationale : Réfrigérateur Samsung Inox 450L + Cuisinière Whirlpool 5 feux + Robot Moulinex.',
      ar: 'جهّز مطبخك بأجهزة متناسقة من الإينوكس: ثلاجة سامسونج إينوكس + طباخة وربول 5 عيون + محضر طعام مولينكس.',
    },
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    normalPrice: 12770,
    packPrice: 11990,
    price: 11990,
    oldPrice: 12770,
    savings: 780,
    isActive: true,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    badge: {
      fr: 'PACK STAR CUISINE',
      ar: 'باك المطبخ النجم',
    },
    packProducts: [
      { productId: 'prod-001', quantity: 1 },
      { productId: 'prod-003', quantity: 1 },
      { productId: 'prod-008', quantity: 1 },
    ],
    products: [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[2], INITIAL_PRODUCTS[7]],
  },
  {
    id: 'pack-appartement',
    name: {
      fr: 'Pack Équipement Appartement & Climatisation',
      ar: 'باك تجهيز الشقة وتكييف الهواء',
    },
    slug: 'pack-appartement-climatisation',
    reference: 'PACK-APPART-CLIM',
    description: {
      fr: 'Idéal pour l aménagement d un nouvel appartement : Réfrigérateur No Frost + Machine à laver 9kg + Climatiseur Carrier 12000 BTU Inverter.',
      ar: 'مثالي لتجهيز شقة جديدة: ثلاجة نوفروست + غسالة ملابس 9 كجم + مكيف كاريير 12000 BTU إنفرتر.',
    },
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    normalPrice: 15970,
    packPrice: 14990,
    price: 14990,
    oldPrice: 15970,
    savings: 980,
    isActive: true,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    badge: {
      fr: 'LIVRAISON GRATUITE TAOURIRT',
      ar: 'توصيل مجاني بتاوريرت',
    },
    packProducts: [
      { productId: 'prod-001', quantity: 1 },
      { productId: 'prod-002', quantity: 1 },
      { productId: 'prod-004', quantity: 1 },
    ],
    products: [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1], INITIAL_PRODUCTS[3]],
  },
  {
    id: 'pack-famille',
    name: {
      fr: 'Pack Grande Famille (Réfrigérateur + Congélateur + Lave-Linge)',
      ar: 'باك العائلة الكبيرة (ثلاجة + مجمد + غسالة)',
    },
    slug: 'pack-grande-famille',
    reference: 'PACK-FAMILLE-CONGEL',
    description: {
      fr: 'Spécialement conçu pour les grandes familles à Taourirt : Grand Réfrigérateur Samsung + Congélateur Beko 300L + Lave-linge Bosch 9kg.',
      ar: 'مصمم خصيصاً للعائلات الكبيرة في تاوريرت: ثلاجة كبيرة + فريزر مجمد 300 لتر + غسالة ملابس بوش 9 كجم.',
    },
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80',
    normalPrice: 15170,
    packPrice: 13990,
    price: 13990,
    oldPrice: 15170,
    savings: 1180,
    isActive: true,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    badge: {
      fr: 'ÉCONOMIE GARANTIE',
      ar: 'توفير مضمون',
    },
    packProducts: [
      { productId: 'prod-001', quantity: 1 },
      { productId: 'prod-006', quantity: 1 },
      { productId: 'prod-002', quantity: 1 },
    ],
    products: [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[5], INITIAL_PRODUCTS[1]],
  },
  {
    id: 'pack-economique',
    name: {
      fr: 'Pack Petit Électroménager Économique (3 Appareils)',
      ar: 'باك الأجهزة الصغيرة الاقتصادي (3 أجهزة)',
    },
    slug: 'pack-petit-electromenager-economique',
    reference: 'PACK-PETIT-ECO',
    description: {
      fr: 'Le trio indispensable pour votre cuisine : Robot Moulinex MasterChef + Friteuse Tefal Air Fryer + Bouilloire Tefal Inox.',
      ar: 'الثلاثي الأساسي لمطبخك: محضر طعام مولينكس + مقلاة تيفال بدون زيت + غلاية ماء تيفال إينوكس.',
    },
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=1200&q=80',
    normalPrice: 2970,
    packPrice: 2690,
    price: 2690,
    oldPrice: 2970,
    savings: 280,
    isActive: true,
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    badge: {
      fr: 'PETIT PRIX',
      ar: 'سعر مناسب جداً',
    },
    packProducts: [
      { productId: 'prod-008', quantity: 1 },
      { productId: 'prod-009', quantity: 1 },
      { productId: 'prod-013', quantity: 1 },
    ],
    products: [INITIAL_PRODUCTS[7], INITIAL_PRODUCTS[8], INITIAL_PRODUCTS[12]],
  },
];
