import { Promotion } from '../types.js';

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-001',
    productId: 'prod-001',
    title: {
      fr: 'Offre Spéciale Réfrigérateur Samsung 450L',
      ar: 'عرض خاص ثلاجة سامسونج 450 لتر',
    },
    oldPrice: 7200,
    newPrice: 6490,
    discountPercentage: 10,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    isActive: true,
  },
  {
    id: 'promo-002',
    productId: 'prod-002',
    title: {
      fr: 'Promo Été Lave-linge Bosch 9kg EcoSilence',
      ar: 'تخفيض الصيف غسالة بوش 9 كجم',
    },
    oldPrice: 5800,
    newPrice: 5290,
    discountPercentage: 9,
    startDate: '2026-08-01',
    endDate: '2026-08-25',
    isActive: true,
  },
  {
    id: 'promo-003',
    productId: 'prod-008',
    title: {
      fr: 'Promotion Robot Ménager Moulinex MasterChef',
      ar: 'تخفيض محضر الطعام مولينكس ماستر شيف',
    },
    oldPrice: 1650,
    newPrice: 1390,
    discountPercentage: 16,
    startDate: '2026-08-01',
    endDate: '2026-08-30',
    isActive: true,
  },
  {
    id: 'promo-004',
    productId: 'prod-009',
    title: {
      fr: 'Remise Santée Tefal Air Fryer XXL',
      ar: 'خصم صحي مقلاة تيفال بدون زيت',
    },
    oldPrice: 1490,
    newPrice: 1290,
    discountPercentage: 13,
    startDate: '2026-08-01',
    endDate: '2026-08-30',
    isActive: true,
  },
];
