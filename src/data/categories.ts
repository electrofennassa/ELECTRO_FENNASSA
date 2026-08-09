import { Category, CategoryType, GrosSubCategory, PetitSubCategory } from '../types.js';

export interface CategoryMeta {
  id: CategoryType;
  title: { fr: string; ar: string };
  description: { fr: string; ar: string };
  image: string;
  subcategories: {
    id: GrosSubCategory | PetitSubCategory;
    title: { fr: string; ar: string };
  }[];
}

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'gros-electromenager',
    name: {
      fr: 'Gros Électroménager',
      ar: 'الأجهزة الكبيرة',
    },
    slug: 'gros-electromenager',
    description: {
      fr: 'Réfrigérateurs, machines à laver, cuisinières, climatiseurs et plus pour votre maison à Taourirt.',
      ar: 'الثلاجات، الغسالات، الأفران، المكيفات والمزيد لمنزلك في تاوريرت.',
    },
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
  {
    id: 'petit-electromenager',
    name: {
      fr: 'Petit Électroménager',
      ar: 'الأجهزة الصغيرة',
    },
    slug: 'petit-electromenager',
    description: {
      fr: 'Cafetières, robots de cuisine, aspirateurs et friteuses sans huile pour équiper votre quotidien.',
      ar: 'آلات القهوة، محضرات الطعام، المكنسات الكهربائية والمقالي الهوائية ليومياتك.',
    },
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  },
];

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'gros-electromenager',
    title: {
      fr: 'Gros Électroménager',
      ar: 'الأجهزة الكبيرة',
    },
    description: {
      fr: 'Réfrigérateurs, machines à laver, cuisinières, climatiseurs et plus pour votre maison à Taourirt.',
      ar: 'الثلاجات، الغسالات، الأفران، المكيفات والمزيد لمنزلك في تاوريرت.',
    },
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { id: 'refrigerateurs', title: { fr: 'Réfrigérateurs', ar: 'ثلاجات' } },
      { id: 'congelateurs', title: { fr: 'Congélateurs', ar: 'مجمدات' } },
      { id: 'machines-a-laver', title: { fr: 'Machines à laver', ar: 'غسالات الملابس' } },
      { id: 'seche-linge', title: { fr: 'Sèche-linge', ar: 'مجففات الملابس' } },
      { id: 'lave-vaisselle', title: { fr: 'Lave-vaisselle', ar: 'غسالات الأواني' } },
      { id: 'cuisinieres', title: { fr: 'Cuisinières', ar: 'مواقد وطباخات' } },
      { id: 'fours', title: { fr: 'Fours', ar: 'أفران' } },
      { id: 'plaques-de-cuisson', title: { fr: 'Plaques de cuisson', ar: 'لوحات الطبخ' } },
      { id: 'hottes', title: { fr: 'Hottes', ar: 'شفاطات المطبخ' } },
      { id: 'climatiseurs', title: { fr: 'Climatiseurs', ar: 'مكيفات الهواء' } },
      { id: 'chauffe-eau', title: { fr: 'Chauffe-eau', ar: 'سخانات الماء' } },
    ],
  },
  {
    id: 'petit-electromenager',
    title: {
      fr: 'Petit Électroménager',
      ar: 'الأجهزة الصغيرة',
    },
    description: {
      fr: 'Cafetières, robots de cuisine, aspirateurs et friteuses sans huile pour équiper votre quotidien.',
      ar: 'آلات القهوة، محضرات الطعام، المكنسات الكهربائية والمقالي الهوائية ليومياتك.',
    },
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
    subcategories: [
      { id: 'cafetieres', title: { fr: 'Cafetières', ar: 'آلات القهوة' } },
      { id: 'bouilloires', title: { fr: 'Bouilloires', ar: 'غلايات الماء' } },
      { id: 'mixeurs', title: { fr: 'Mixeurs', ar: 'خلاطات يدوية' } },
      { id: 'blenders', title: { fr: 'Blenders', ar: 'خلاطات كهربائية' } },
      { id: 'robots-de-cuisine', title: { fr: 'Robots de cuisine', ar: 'محضرات الطعام' } },
      { id: 'friteuses', title: { fr: 'Friteuses', ar: 'مقالي هوائية' } },
      { id: 'grille-pain', title: { fr: 'Grille-pain', ar: 'محمصات الخبز' } },
      { id: 'aspirateurs', title: { fr: 'Aspirateurs', ar: 'مكنسات كهربائية' } },
      { id: 'presse-agrumes', title: { fr: 'Presse-agrumes', ar: 'عصارات الفواكه' } },
      { id: 'appareils-de-cuisson', title: { fr: 'Appareils de cuisson', ar: 'أجهزة الطهي' } },
      { id: 'autres', title: { fr: 'Autres', ar: 'ملحقات أخرى' } },
    ],
  },
];
