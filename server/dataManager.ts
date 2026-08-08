import { db } from './db';
import { supabaseDb } from './services/supabaseDb';
import {
  Product,
  Category,
  Brand,
  Promotion,
  Pack,
  CustomerRecord,
  Order,
  OrderStatus,
  DashboardStats,
} from '../src/types';

/**
 * Unified Data Abstraction Layer
 * Routes transparently to Supabase PostgreSQL when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set,
 * otherwise falls back safely to server/db.ts (local file storage).
 */
export const dataManager = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (supabaseDb.isAvailable()) {
      try {
        return await supabaseDb.getProducts();
      } catch (err) {
        console.warn('Supabase getProducts failed, falling back to local DB:', err);
      }
    }
    return db.getProducts();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.createProduct(product);
    }
    return db.createProduct(product);
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.updateProduct(id, updates);
    }
    return db.updateProduct(id, updates);
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.deleteProduct(id);
    }
    return db.deleteProduct(id);
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (supabaseDb.isAvailable()) {
      try {
        return await supabaseDb.getCategories();
      } catch (err) {
        console.warn('Supabase getCategories failed, falling back to local DB:', err);
      }
    }
    return db.getCategories();
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.createCategory(cat);
    }
    return db.createCategory(cat);
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.updateCategory(id, updates);
    }
    return db.updateCategory(id, updates);
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.deleteCategory(id);
    }
    return db.deleteCategory(id);
  },

  // BRANDS
  async getBrands(): Promise<Brand[]> {
    if (supabaseDb.isAvailable()) {
      try {
        return await supabaseDb.getBrands();
      } catch (err) {
        console.warn('Supabase getBrands failed, falling back to local DB:', err);
      }
    }
    return db.getBrands();
  },

  async createBrand(brand: Partial<Brand>): Promise<Brand> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.createBrand(brand);
    }
    return db.createBrand(brand);
  },

  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | null> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.updateBrand(id, updates);
    }
    return db.updateBrand(id, updates);
  },

  async deleteBrand(id: string): Promise<boolean> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.deleteBrand(id);
    }
    return db.deleteBrand(id);
  },

  // PROMOTIONS
  async getPromotions(): Promise<Promotion[]> {
    if (supabaseDb.isAvailable()) {
      try {
        return await supabaseDb.getPromotions();
      } catch (err) {
        console.warn('Supabase getPromotions failed, falling back to local DB:', err);
      }
    }
    return db.getPromotions();
  },

  async createPromotion(promo: Partial<Promotion>): Promise<Promotion> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.createPromotion(promo);
    }
    return db.createPromotion(promo);
  },

  async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion | null> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.updatePromotion(id, updates);
    }
    return db.updatePromotion(id, updates);
  },

  async deletePromotion(id: string): Promise<boolean> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.deletePromotion(id);
    }
    return db.deletePromotion(id);
  },

  // PACKS
  async getPacks(): Promise<Pack[]> {
    if (supabaseDb.isAvailable()) {
      try {
        return await supabaseDb.getPacks();
      } catch (err) {
        console.warn('Supabase getPacks failed, falling back to local DB:', err);
      }
    }
    return db.getPacks();
  },

  async createPack(pack: Partial<Pack>): Promise<Pack> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.createPack(pack);
    }
    return db.createPack(pack);
  },

  async updatePack(id: string, updates: Partial<Pack>): Promise<Pack | null> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.updatePack(id, updates);
    }
    return db.updatePack(id, updates);
  },

  async deletePack(id: string): Promise<boolean> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.deletePack(id);
    }
    return db.deletePack(id);
  },

  // ORDERS & CUSTOMERS
  async getOrders(): Promise<Order[]> {
    if (supabaseDb.isAvailable()) {
      try {
        return await supabaseDb.getOrders();
      } catch (err) {
        console.warn('Supabase getOrders failed, falling back to local DB:', err);
      }
    }
    return db.getOrders();
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.getOrderById(id);
    }
    return db.getOrderById(id);
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.updateOrderStatus(id, status);
    }
    return db.updateOrderStatus(id, status);
  },

  async createOrder(params: {
    fullName: string;
    phone: string;
    email?: string;
    city?: string;
    address: string;
    notes?: string;
    items: Array<{
      productId: string;
      quantity: number;
      productName?: string;
      productReference?: string;
      price?: number;
    }>;
  }): Promise<Order> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.createOrder(params);
    }

    const itemsForDb = params.items.map((i) => {
      const prod = db.getProductById(i.productId);
      return {
        productId: i.productId,
        productName: i.productName || prod?.name.fr || 'Produit',
        productReference: i.productReference || prod?.reference || 'REF-GEN',
        quantity: i.quantity,
        price: prod ? prod.price : i.price || 0,
      };
    });

    return db.createOrder({
      fullName: params.fullName,
      phone: params.phone,
      email: params.email,
      city: params.city || 'Taourirt',
      address: params.address,
      notes: params.notes,
      items: itemsForDb,
    });
  },

  async getCustomers(): Promise<CustomerRecord[]> {
    if (supabaseDb.isAvailable()) {
      try {
        return await supabaseDb.getCustomers();
      } catch (err) {
        console.warn('Supabase getCustomers failed, falling back to local DB:', err);
      }
    }
    return db.getCustomers();
  },

  async getCustomerById(id: string): Promise<CustomerRecord | null> {
    if (supabaseDb.isAvailable()) {
      return supabaseDb.getCustomerById(id);
    }
    return db.getCustomerById(id);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    if (supabaseDb.isAvailable()) {
      try {
        return await supabaseDb.getDashboardStats();
      } catch (err) {
        console.warn('Supabase getDashboardStats failed, falling back to local DB:', err);
      }
    }
    return db.getDashboardStats();
  },
};
