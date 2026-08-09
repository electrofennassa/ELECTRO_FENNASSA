import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Types
import {
  Product,
  Category,
  Brand,
  Promotion,
  Pack,
  CustomerRecord,
  Order,
  OrderItem,
  User,
  DashboardStats,
  OrderStatus,
} from '../src/types.js';

import { INITIAL_PRODUCTS } from '../src/data/products.js';
import { INITIAL_CATEGORIES } from '../src/data/categories.js';
import { INITIAL_BRANDS } from '../src/data/brands.js';
import { INITIAL_PROMOTIONS } from '../src/data/promotions.js';
import { INITIAL_PACKS } from '../src/data/packs.js';

export interface DatabaseSchema {
  users: User[];
  customers: CustomerRecord[];
  orders: Order[];
  products: Product[];
  categories: Category[];
  brands: Brand[];
  promotions: Promotion[];
  packs: Pack[];
  orderCounter: number;
}

const DB_PATH = process.env.VERCEL ? path.join('/tmp', 'db.json') : path.join(process.cwd(), 'data', 'db.json');

// Initial seed data for orders & customers
const initialCustomers: CustomerRecord[] = [
  {
    id: 'cust-1',
    fullName: 'Mohamed Bennani',
    phone: '0661234567',
    email: 'm.bennani@email.ma',
    city: 'Taourirt',
    address: 'Rue 10 N 15, Quartier Hay Jdid',
    notes: 'Préfère la livraison en début d après-midi',
    totalOrders: 2,
    totalSpent: 12400,
    lastOrderDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'cust-2',
    fullName: 'Fatima Zahra El Amrani',
    phone: '0665987654',
    email: '',
    city: 'Taourirt',
    address: 'Boulevard Moulay Ismail, Appt 4',
    notes: 'Appeler 30 minutes avant de venir',
    totalOrders: 1,
    totalSpent: 4800,
    lastOrderDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'cust-3',
    fullName: 'Karim Mansouri',
    phone: '0670112233',
    email: 'k.mansouri@gmail.com',
    city: 'Taourirt',
    address: 'Avenue de la Marche Verte, Taourirt',
    notes: '',
    totalOrders: 1,
    totalSpent: 8900,
    lastOrderDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'EF-2026-000001',
    customerId: 'cust-1',
    customerName: 'Mohamed Bennani',
    customerPhone: '0661234567',
    customerEmail: 'm.bennani@email.ma',
    city: 'Taourirt',
    address: 'Rue 10 N 15, Quartier Hay Jdid',
    notes: 'Préfère la livraison en début d après-midi',
    subtotal: 7500,
    discount: 0,
    deliveryFee: 0,
    total: 7500,
    totalAmount: 7500,
    paymentMethod: 'Paiement à la livraison',
    status: 'Livrée',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    customer: {
      id: 'cust-1',
      fullName: 'Mohamed Bennani',
      phone: '0661234567',
      email: 'm.bennani@email.ma',
      city: 'Taourirt',
      address: 'Rue 10 N 15, Quartier Hay Jdid',
      notes: 'Préfère la livraison en début d après-midi',
    },
    items: [
      {
        id: 'item-101',
        orderId: 'ord-1001',
        productId: 'prod-samsung-rt38',
        productName: 'Réfrigérateur Samsung NoFrost 380L Inox',
        productReference: 'REF-SAM-RT38',
        quantity: 1,
        unitPrice: 7500,
        totalPrice: 7500,
      },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'EF-2026-000002',
    customerId: 'cust-2',
    customerName: 'Fatima Zahra El Amrani',
    customerPhone: '0665987654',
    customerEmail: '',
    city: 'Taourirt',
    address: 'Boulevard Moulay Ismail, Appt 4',
    notes: 'Appeler 30 minutes avant de venir',
    subtotal: 4800,
    discount: 0,
    deliveryFee: 0,
    total: 4800,
    totalAmount: 4800,
    paymentMethod: 'Paiement à la livraison',
    status: 'En livraison',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    customer: {
      id: 'cust-2',
      fullName: 'Fatima Zahra El Amrani',
      phone: '0665987654',
      email: '',
      city: 'Taourirt',
      address: 'Boulevard Moulay Ismail, Appt 4',
      notes: 'Appeler 30 minutes avant de venir',
    },
    items: [
      {
        id: 'item-102',
        orderId: 'ord-1002',
        productId: 'prod-lg-f4v3',
        productName: 'Lave-Linge LG Vivace 8kg Direct Drive',
        productReference: 'REF-LG-F4V3',
        quantity: 1,
        unitPrice: 4800,
        totalPrice: 4800,
      },
    ],
  },
  {
    id: 'ord-1003',
    orderNumber: 'EF-2026-000003',
    customerId: 'cust-3',
    customerName: 'Karim Mansouri',
    customerPhone: '0670112233',
    customerEmail: 'k.mansouri@gmail.com',
    city: 'Taourirt',
    address: 'Avenue de la Marche Verte, Taourirt',
    notes: 'Commande de démonstration',
    subtotal: 8900,
    discount: 0,
    deliveryFee: 0,
    total: 8900,
    totalAmount: 8900,
    paymentMethod: 'Paiement à la livraison',
    status: 'Nouvelle',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    date: new Date().toISOString(),
    customer: {
      id: 'cust-3',
      fullName: 'Karim Mansouri',
      phone: '0670112233',
      email: 'k.mansouri@gmail.com',
      city: 'Taourirt',
      address: 'Avenue de la Marche Verte, Taourirt',
      notes: 'Commande de démonstration',
    },
    items: [
      {
        id: 'item-103',
        orderId: 'ord-1003',
        productId: 'pack-mariage-3',
        productName: 'Pack Cuisine Complet Taourirt',
        productReference: 'PACK-CUIS-01',
        quantity: 1,
        unitPrice: 8900,
        totalPrice: 8900,
      },
    ],
  },
];

const initialDatabase: DatabaseSchema = {
  users: [
    {
      id: 'usr-admin-1',
      email: process.env.ADMIN_EMAIL || 'admin@electrofennassa.ma',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
  ],
  customers: initialCustomers,
  orders: initialOrders,
  products: INITIAL_PRODUCTS,
  categories: INITIAL_CATEGORIES,
  brands: INITIAL_BRANDS,
  promotions: INITIAL_PROMOTIONS,
  packs: INITIAL_PACKS,
  orderCounter: 4,
};

class JsonDatabase {
  private memoryData: DatabaseSchema;

  constructor() {
    this.memoryData = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          users: parsed.users || initialDatabase.users,
          customers: parsed.customers || initialDatabase.customers,
          orders: parsed.orders || initialDatabase.orders,
          products: parsed.products || initialDatabase.products,
          categories: parsed.categories || initialDatabase.categories,
          brands: parsed.brands || initialDatabase.brands,
          promotions: parsed.promotions || initialDatabase.promotions,
          packs: parsed.packs || initialDatabase.packs,
          orderCounter: parsed.orderCounter || initialDatabase.orderCounter,
        };
      } else {
        this.saveDataDirect(initialDatabase);
        return initialDatabase;
      }
    } catch (err) {
      console.error('Error loading DB file, falling back to initial database:', err);
      return initialDatabase;
    }
  }

  private saveDataDirect(data: DatabaseSchema) {
    try {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing DB file:', e);
    }
  }

  private persist() {
    this.saveDataDirect(this.memoryData);
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return this.memoryData.products;
  }

  public getProductById(id: string): Product | undefined {
    return this.memoryData.products.find((p) => p.id === id);
  }

  public createProduct(data: Partial<Product>): Product {
    const now = new Date().toISOString();
    const id = 'prod-' + Date.now();
    const frName = data.name?.fr || 'Nouveau Produit';
    const slug = data.slug || frName.toLowerCase().replace(/[^\w]+/g, '-') || id;
    const price = data.price || 0;
    const oldPrice = data.oldPrice;
    const discountPercentage = oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : data.discountPercentage || 0;

    const newProd: Product = {
      id,
      slug,
      reference: data.reference || `REF-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: data.name || { fr: 'Nouveau Produit', ar: 'منتج جديد' },
      brandId: data.brandId || 'brand-samsung',
      brand: data.brand || 'Samsung',
      categoryId: data.categoryId || 'gros-electromenager',
      category: data.category || data.categoryId || 'gros-electromenager',
      subCategoryId: data.subCategoryId,
      subCategory: data.subCategory,
      description: data.description || { fr: '', ar: '' },
      technicalSpecifications: data.technicalSpecifications || data.specifications || [],
      specifications: data.specifications || data.technicalSpecifications || [],
      price,
      oldPrice,
      discountPercentage,
      warranty: data.warranty || '2 ans Garantie',
      dimensions: data.dimensions || '',
      color: data.color || { fr: 'Inox', ar: 'إينوكس' },
      power: data.power || '',
      isNew: data.isNew ?? true,
      isPromotion: data.isPromotion ?? (discountPercentage > 0),
      isPromo: data.isPromo ?? (discountPercentage > 0),
      promoEndDate: data.promoEndDate,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now,
      badge: data.badge,
      mainImage: data.mainImage || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      images: data.images && data.images.length > 0 ? data.images : [data.mainImage || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
      featured: data.featured || false,
    };

    this.memoryData.products.unshift(newProd);
    this.persist();
    return newProd;
  }

  public updateProduct(id: string, data: Partial<Product>): Product | null {
    const idx = this.memoryData.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const existing = this.memoryData.products[idx];
    const price = data.price !== undefined ? data.price : existing.price;
    const oldPrice = data.oldPrice !== undefined ? data.oldPrice : existing.oldPrice;
    const discountPercentage = oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

    const updated: Product = {
      ...existing,
      ...data,
      price,
      oldPrice,
      discountPercentage,
      isPromotion: discountPercentage > 0,
      isPromo: discountPercentage > 0,
      updatedAt: new Date().toISOString(),
    };

    this.memoryData.products[idx] = updated;
    this.persist();
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const initLen = this.memoryData.products.length;
    this.memoryData.products = this.memoryData.products.filter((p) => p.id !== id);
    if (this.memoryData.products.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.memoryData.categories;
  }

  public createCategory(data: Partial<Category>): Category {
    const id = data.id || 'cat-' + Date.now();
    const frName = data.name?.fr || 'Nouvelle Catégorie';
    const newCat: Category = {
      id,
      name: data.name || { fr: 'Nouvelle Catégorie', ar: 'فئة جديدة' },
      slug: data.slug || frName.toLowerCase().replace(/[^\w]+/g, '-'),
      description: data.description || { fr: '', ar: '' },
      image: data.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      parentId: data.parentId,
      isActive: data.isActive ?? true,
    };
    this.memoryData.categories.push(newCat);
    this.persist();
    return newCat;
  }

  public updateCategory(id: string, data: Partial<Category>): Category | null {
    const idx = this.memoryData.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.memoryData.categories[idx] = { ...this.memoryData.categories[idx], ...data };
    this.persist();
    return this.memoryData.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const initLen = this.memoryData.categories.length;
    this.memoryData.categories = this.memoryData.categories.filter((c) => c.id !== id);
    if (this.memoryData.categories.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- BRANDS ---
  public getBrands(): Brand[] {
    return this.memoryData.brands;
  }

  public createBrand(data: Partial<Brand>): Brand {
    const id = data.id || 'brand-' + Date.now();
    const name = data.name || 'Nouvelle Marque';
    const newBrand: Brand = {
      id,
      name,
      slug: data.slug || name.toLowerCase().replace(/[^\w]+/g, '-'),
      logo: data.logo || 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80',
      description: data.description || { fr: '', ar: '' },
      isActive: data.isActive ?? true,
    };
    this.memoryData.brands.push(newBrand);
    this.persist();
    return newBrand;
  }

  public updateBrand(id: string, data: Partial<Brand>): Brand | null {
    const idx = this.memoryData.brands.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.memoryData.brands[idx] = { ...this.memoryData.brands[idx], ...data };
    this.persist();
    return this.memoryData.brands[idx];
  }

  public deleteBrand(id: string): boolean {
    const initLen = this.memoryData.brands.length;
    this.memoryData.brands = this.memoryData.brands.filter((b) => b.id !== id);
    if (this.memoryData.brands.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- PROMOTIONS ---
  public getPromotions(): Promotion[] {
    return this.memoryData.promotions;
  }

  public createPromotion(data: Partial<Promotion>): Promotion {
    const id = 'promo-' + Date.now();
    const oldPrice = data.oldPrice || 0;
    const newPrice = data.newPrice || 0;
    const discountPercentage = oldPrice > newPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;

    const newPromo: Promotion = {
      id,
      productId: data.productId || '',
      title: data.title || { fr: 'Nouvelle Promotion', ar: 'تخفيض جديد' },
      oldPrice,
      newPrice,
      discountPercentage,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      isActive: data.isActive ?? true,
    };

    this.memoryData.promotions.unshift(newPromo);

    if (data.productId) {
      this.updateProduct(data.productId, {
        price: newPrice,
        oldPrice: oldPrice,
        isPromotion: true,
        isPromo: true,
      });
    }

    this.persist();
    return newPromo;
  }

  public updatePromotion(id: string, data: Partial<Promotion>): Promotion | null {
    const idx = this.memoryData.promotions.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const existing = this.memoryData.promotions[idx];
    const oldPrice = data.oldPrice !== undefined ? data.oldPrice : existing.oldPrice;
    const newPrice = data.newPrice !== undefined ? data.newPrice : existing.newPrice;
    const discountPercentage = oldPrice > newPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;

    const updated: Promotion = {
      ...existing,
      ...data,
      oldPrice,
      newPrice,
      discountPercentage,
    };
    this.memoryData.promotions[idx] = updated;
    this.persist();
    return updated;
  }

  public deletePromotion(id: string): boolean {
    const initLen = this.memoryData.promotions.length;
    this.memoryData.promotions = this.memoryData.promotions.filter((p) => p.id !== id);
    if (this.memoryData.promotions.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- PACKS ---
  public getPacks(): Pack[] {
    return this.memoryData.packs;
  }

  public createPack(data: Partial<Pack>): Pack {
    const id = 'pack-' + Date.now();
    const now = new Date().toISOString();
    const frName = data.name?.fr || 'Nouveau Pack';
    const normalPrice = data.normalPrice || 0;
    const packPrice = data.packPrice || data.price || 0;
    const savings = normalPrice > packPrice ? normalPrice - packPrice : 0;

    const newPack: Pack = {
      id,
      name: data.name || { fr: 'Nouveau Pack', ar: 'باك جديد' },
      slug: data.slug || frName.toLowerCase().replace(/[^\w]+/g, '-'),
      reference: data.reference || `PACK-${Math.floor(Math.random() * 900 + 100)}`,
      description: data.description || { fr: '', ar: '' },
      image: data.image || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      normalPrice,
      packPrice,
      price: packPrice,
      oldPrice: normalPrice,
      savings,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now,
      badge: data.badge || { fr: `ÉCONOMISEZ ${savings} DH`, ar: `وفر ${savings} درهم` },
      packProducts: data.packProducts || [],
      products: data.products || [],
    };

    this.memoryData.packs.unshift(newPack);
    this.persist();
    return newPack;
  }

  public updatePack(id: string, data: Partial<Pack>): Pack | null {
    const idx = this.memoryData.packs.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    const existing = this.memoryData.packs[idx];
    const normalPrice = data.normalPrice !== undefined ? data.normalPrice : existing.normalPrice;
    const packPrice = data.packPrice !== undefined ? data.packPrice : existing.packPrice;
    const savings = normalPrice > packPrice ? normalPrice - packPrice : 0;

    const updated: Pack = {
      ...existing,
      ...data,
      normalPrice,
      packPrice,
      price: packPrice,
      oldPrice: normalPrice,
      savings,
      updatedAt: new Date().toISOString(),
    };
    this.memoryData.packs[idx] = updated;
    this.persist();
    return updated;
  }

  public deletePack(id: string): boolean {
    const initLen = this.memoryData.packs.length;
    this.memoryData.packs = this.memoryData.packs.filter((p) => p.id !== id);
    if (this.memoryData.packs.length !== initLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- ORDERS & CUSTOMERS ---
  public getOrders(): Order[] {
    return this.memoryData.orders;
  }

  public getOrderById(id: string): Order | undefined {
    return this.memoryData.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public getCustomers(): CustomerRecord[] {
    return this.memoryData.customers;
  }

  public getCustomerById(id: string): CustomerRecord | undefined {
    return this.memoryData.customers.find((c) => c.id === id);
  }

  public createOrder(payload: {
    fullName: string;
    phone: string;
    email?: string;
    city: string; // Taourirt
    address: string;
    notes?: string;
    items: {
      productId: string;
      productName?: string;
      productReference?: string;
      quantity: number;
      price: number;
    }[];
  }): Order {
    const now = new Date().toISOString();
    const orderId = 'ord-' + Date.now();

    // Generate Order Number: EF-2026-00000X
    const year = new Date().getFullYear();
    const seqStr = String(this.memoryData.orderCounter).padStart(6, '0');
    const orderNumber = `EF-${year}-${seqStr}`;
    this.memoryData.orderCounter += 1;

    // Find or Create Customer
    let customer = this.memoryData.customers.find(
      (c) => c.phone.trim() === payload.phone.trim()
    );

    const subtotal = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 0;
    const deliveryFee = 0; // Free in Taourirt
    const total = subtotal - discount + deliveryFee;

    if (!customer) {
      customer = {
        id: 'cust-' + Date.now(),
        fullName: payload.fullName,
        phone: payload.phone,
        email: payload.email || '',
        city: 'Taourirt',
        address: payload.address,
        notes: payload.notes || '',
        totalOrders: 1,
        totalSpent: total,
        lastOrderDate: now,
        createdAt: now,
        updatedAt: now,
      };
      this.memoryData.customers.push(customer);
    } else {
      customer.totalOrders += 1;
      customer.totalSpent += total;
      customer.lastOrderDate = now;
      customer.address = payload.address || customer.address;
      customer.updatedAt = now;
    }

    // Build Order Items
    const orderItems: OrderItem[] = payload.items.map((it, idx) => {
      const prod = this.getProductById(it.productId);
      return {
        id: `item-${orderId}-${idx + 1}`,
        orderId: orderId,
        productId: it.productId,
        productName: it.productName || prod?.name.fr || 'Produit',
        productReference: it.productReference || prod?.reference || 'REF-GEN',
        quantity: it.quantity, // NOTE: Ordered quantity ONLY. Not stock.
        unitPrice: it.price,
        totalPrice: it.price * it.quantity,
      };
    });

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      city: 'Taourirt',
      address: payload.address,
      notes: payload.notes || '',
      subtotal,
      discount,
      deliveryFee,
      total,
      totalAmount: total,
      paymentMethod: 'Paiement à la livraison',
      status: 'Nouvelle',
      createdAt: now,
      updatedAt: now,
      date: now,
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        city: 'Taourirt',
        address: payload.address,
        notes: payload.notes,
      },
      items: orderItems,
    };

    this.memoryData.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const idx = this.memoryData.orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (idx === -1) return null;

    this.memoryData.orders[idx].status = status;
    this.memoryData.orders[idx].updatedAt = new Date().toISOString();
    this.persist();
    return this.memoryData.orders[idx];
  }

  // --- STATS FOR ADMIN DASHBOARD ---
  public getDashboardStats(): DashboardStats {
    const orders = this.memoryData.orders;
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let ordersToday = 0;
    let ordersThisWeek = 0;
    let ordersThisMonth = 0;

    let revenueToday = 0;
    let revenueThisWeek = 0;
    let revenueThisMonth = 0;

    const statusCounts: Record<OrderStatus, number> = {
      Nouvelle: 0,
      Confirmée: 0,
      'En préparation': 0,
      'En livraison': 0,
      Livrée: 0,
      Annulée: 0,
      en_attente: 0,
    };

    orders.forEach((o) => {
      const orderTime = new Date(o.createdAt).getTime();

      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status] += 1;
      }

      if (o.status !== 'Annulée') {
        if (orderTime >= startOfToday) {
          ordersToday += 1;
          revenueToday += o.total;
        }
        if (orderTime >= startOfWeek) {
          ordersThisWeek += 1;
          revenueThisWeek += o.total;
        }
        if (orderTime >= startOfMonth) {
          ordersThisMonth += 1;
          revenueThisMonth += o.total;
        }
      }
    });

    return {
      orders: {
        today: ordersToday,
        thisWeek: ordersThisWeek,
        thisMonth: ordersThisMonth,
      },
      revenue: {
        today: revenueToday,
        thisWeek: revenueThisWeek,
        thisMonth: revenueThisMonth,
      },
      statusCounts,
      catalogCounts: {
        products: this.memoryData.products.length,
        categories: this.memoryData.categories.length,
        brands: this.memoryData.brands.length,
        promotions: this.memoryData.promotions.length,
        packs: this.memoryData.packs.length,
      },
    };
  }
}

export const db = new JsonDatabase();
