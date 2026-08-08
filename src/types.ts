export type Language = 'fr' | 'ar';

export type CategoryType = 'gros-electromenager' | 'petit-electromenager' | string;

export type GrosSubCategory =
  | 'refrigerateurs'
  | 'congelateurs'
  | 'machines-a-laver'
  | 'seche-linge'
  | 'lave-vaisselle'
  | 'cuisinieres'
  | 'fours'
  | 'plaques-de-cuisson'
  | 'hottes'
  | 'climatiseurs'
  | 'chauffe-eau';

export type PetitSubCategory =
  | 'cafetieres'
  | 'bouilloires'
  | 'mixeurs'
  | 'blenders'
  | 'robots-de-cuisine'
  | 'friteuses'
  | 'grille-pain'
  | 'aspirateurs'
  | 'presse-agrumes'
  | 'appareils-de-cuisson'
  | 'autres';

export type SubCategoryType = GrosSubCategory | PetitSubCategory | string;

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface SpecificationItem {
  label: { fr: string; ar: string };
  value: { fr: string; ar: string };
}

export interface Product {
  id: string;
  slug: string;
  reference: string;
  name: {
    fr: string;
    ar: string;
  };
  brandId?: string;
  brand: string;
  categoryId: CategoryType;
  category: CategoryType;
  subCategoryId?: SubCategoryType;
  subCategory?: SubCategoryType;
  description: {
    fr: string;
    ar: string;
  };
  technicalSpecifications: SpecificationItem[];
  specifications: SpecificationItem[];
  price: number; // in MAD (DH)
  oldPrice?: number;
  discountPercentage?: number;
  warranty: string;
  dimensions?: string;
  color: {
    fr: string;
    ar: string;
  };
  power?: string;
  isNew?: boolean;
  isPromotion?: boolean;
  isPromo?: boolean;
  promoEndDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  badge?: {
    fr: string;
    ar: string;
  };
  mainImage: string;
  images: string[];
  featured?: boolean;
}

export interface Category {
  id: string;
  name: { fr: string; ar: string };
  slug: string;
  description: { fr: string; ar: string };
  image: string;
  parentId?: string;
  isActive: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: { fr: string; ar: string };
  isActive: boolean;
}

export interface Promotion {
  id: string;
  productId: string;
  title: { fr: string; ar: string };
  oldPrice: number;
  newPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PackItem {
  id?: string;
  productId: string;
  quantity: number;
}

export interface Pack {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
  slug: string;
  reference?: string;
  description: {
    fr: string;
    ar: string;
  };
  image: string;
  normalPrice: number;
  packPrice: number;
  price?: number;
  oldPrice?: number;
  savings: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  badge?: {
    fr: string;
    ar: string;
  };
  packProducts: PackItem[];
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomer {
  id?: string;
  fullName: string;
  phone: string;
  city: string; // Always Taourirt
  address: string;
  email?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerRecord {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'Nouvelle'
  | 'Confirmée'
  | 'En préparation'
  | 'En livraison'
  | 'Livrée'
  | 'Annulée'
  | 'en_attente'; // fallback for legacy code

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productReference: string;
  quantity: number; // NOTE: Ordered quantity ONLY. NOT stock!
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "EF-2026-000001"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string; // Taourirt
  address: string;
  notes?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  totalAmount: number; // for backward compatibility
  paymentMethod: 'Paiement à la livraison' | string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  date: string; // for backward compatibility
  customer: OrderCustomer;
  items: OrderItem[];
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | string;
  createdAt: string;
}

export interface DashboardStats {
  orders: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  statusCounts: Record<OrderStatus, number>;
  catalogCounts: {
    products: number;
    categories: number;
    brands: number;
    promotions: number;
    packs: number;
  };
}

export type PageRoute =
  | 'home'
  | 'catalog'
  | 'gros-electromenager'
  | 'petit-electromenager'
  | 'promotions'
  | 'packs'
  | 'pack-detail'
  | 'marques'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'confirmation'
  | 'contact'
  | 'about'
  | 'delivery'
  | 'faq'
  | 'wishlist'
  | 'warranty'
  | 'terms'
  | 'privacy'
  | 'returns'
  | 'admin'
  | 'admin-login';
