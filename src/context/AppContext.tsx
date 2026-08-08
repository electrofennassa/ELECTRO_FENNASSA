import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  PageRoute,
  Product,
  Category,
  Brand,
  Promotion,
  Pack,
  CartItem,
  Order,
  OrderStatus,
  CategoryType,
  SubCategoryType,
  CustomerRecord,
  DashboardStats,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_BRANDS } from '../data/brands';
import { INITIAL_PROMOTIONS } from '../data/promotions';
import { INITIAL_PACKS } from '../data/packs';
import { TRANSLATIONS } from '../data/translations';
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  fetchCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  fetchBrandsApi,
  createBrandApi,
  updateBrandApi,
  deleteBrandApi,
  fetchPromotionsApi,
  createPromotionApi,
  updatePromotionApi,
  deletePromotionApi,
  fetchPacksApi,
  createPackApi,
  updatePackApi,
  deletePackApi,
  submitOrderApi,
  fetchOrdersApi,
  updateOrderStatusApi,
  fetchCustomersApi,
  fetchDashboardStatsApi,
  checkAuthMe,
  logoutAdmin,
} from '../lib/api';

interface ToastNotice {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface AppContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof TRANSLATIONS['fr'];
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;

  // Admin Auth State
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  logout: () => Promise<void>;

  // Products
  products: Product[];
  addProduct: (product: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Partial<Category>) => Promise<Category>;
  updateCategory: (id: string, categoryData: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Brands
  brands: Brand[];
  addBrand: (brand: Partial<Brand>) => Promise<Brand>;
  updateBrand: (id: string, brandData: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;

  // Promotions
  promotions: Promotion[];
  addPromotion: (promo: Partial<Promotion>) => Promise<Promotion>;
  updatePromotion: (id: string, promoData: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;

  // Packs
  packs: Pack[];
  addPack: (pack: Partial<Pack>) => Promise<Pack>;
  updatePack: (id: string, packData: Partial<Pack>) => Promise<void>;
  deletePack: (id: string) => Promise<void>;
  selectedPack: Pack | null;
  setSelectedPack: (p: Pack | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  addPackToCart: (pack: Pack) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: CategoryType | 'all';
  setSelectedCategoryFilter: (cat: CategoryType | 'all') => void;
  selectedSubCategoryFilter: SubCategoryType | 'all';
  setSelectedSubCategoryFilter: (sub: SubCategoryType | 'all') => void;
  selectedBrandFilter: string | 'all';
  setSelectedBrandFilter: (brand: string | 'all') => void;
  priceMinFilter: number | '';
  setPriceMinFilter: (v: number | '') => void;
  priceMaxFilter: number | '';
  setPriceMaxFilter: (v: number | '') => void;
  onlyPromotionsFilter: boolean;
  setOnlyPromotionsFilter: (v: boolean) => void;
  onlyNewFilter: boolean;
  setOnlyNewFilter: (v: boolean) => void;

  // Orders & Customers
  orders: Order[];
  customers: CustomerRecord[];
  dashboardStats: DashboardStats | null;
  submitOrder: (payload: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    notes?: string;
  }) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  refreshOrders: () => Promise<void>;
  refreshCustomers: () => Promise<void>;
  refreshStats: () => Promise<void>;

  // Toasts
  toasts: ToastNotice[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Wishlist / Favoris
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Recently Viewed
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  // Search History
  searchHistory: string[];
  addSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;

  // Delivery Config (Structure for future config)
  deliveryConfig: {
    type: 'free' | 'fixed' | 'variable' | 'unconfirmed';
    fee: number;
  };
  updateDeliveryConfig: (type: 'free' | 'fixed' | 'variable' | 'unconfirmed', fee?: number) => void;

  // Compatibility helpers
  addProductAdmin: (product: Product) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('ef_lang');
    return saved === 'ar' || saved === 'fr' ? saved : 'fr';
  });

  const [currentPage, setCurrentPageRaw] = useState<PageRoute>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Data states from DB
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [packs, setPacks] = useState<Pack[]>(INITIAL_PACKS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

  // Cart state stored in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ef_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CategoryType | 'all'>('all');
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState<SubCategoryType | 'all'>('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | 'all'>('all');
  const [priceMinFilter, setPriceMinFilter] = useState<number | ''>('');
  const [priceMaxFilter, setPriceMaxFilter] = useState<number | ''>('');
  const [onlyPromotionsFilter, setOnlyPromotionsFilter] = useState<boolean>(false);
  const [onlyNewFilter, setOnlyNewFilter] = useState<boolean>(false);

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  // Wishlist (Favoris)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ef_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recently Viewed Products
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ef_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search History
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ef_search_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Delivery Config
  const [deliveryConfig, setDeliveryConfig] = useState<{
    type: 'free' | 'fixed' | 'variable' | 'unconfirmed';
    fee: number;
  }>(() => {
    try {
      const saved = localStorage.getItem('ef_delivery_config');
      return saved ? JSON.parse(saved) : { type: 'free', fee: 0 };
    } catch {
      return { type: 'free', fee: 0 };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ef_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('ef_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {
      console.error(e);
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem('ef_search_history', JSON.stringify(searchHistory));
    } catch (e) {
      console.error(e);
    }
  }, [searchHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('ef_delivery_config', JSON.stringify(deliveryConfig));
    } catch (e) {
      console.error(e);
    }
  }, [deliveryConfig]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast(lang === 'ar' ? 'تمت إزالة المنتج من المفضلة' : 'Produit retiré des favoris', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast(lang === 'ar' ? 'تمت إضافة المنتج إلى المفضلة' : 'Produit ajouté aux favoris', 'success');
        return [productId, ...prev];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  const addSearchHistory = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 6);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const updateDeliveryConfig = (type: 'free' | 'fixed' | 'variable' | 'unconfirmed', fee = 0) => {
    setDeliveryConfig({ type, fee });
    addToast(lang === 'ar' ? 'تم تحديث خيارات التوصيل' : 'Configuration de livraison mise à jour', 'info');
  };

  // Load initial data from server DB
  useEffect(() => {
    const initData = async () => {
      try {
        const [prods, cats, brnds, promos, pks] = await Promise.all([
          fetchProductsApi().catch(() => INITIAL_PRODUCTS),
          fetchCategoriesApi().catch(() => INITIAL_CATEGORIES),
          fetchBrandsApi().catch(() => INITIAL_BRANDS),
          fetchPromotionsApi().catch(() => INITIAL_PROMOTIONS),
          fetchPacksApi().catch(() => INITIAL_PACKS),
        ]);

        if (prods && prods.length > 0) setProducts(prods);
        if (cats && cats.length > 0) setCategories(cats);
        if (brnds && brnds.length > 0) setBrands(brnds);
        if (promos && promos.length > 0) setPromotions(promos);
        if (pks && pks.length > 0) setPacks(pks);

        // Check Admin Auth
        const authRes = await checkAuthMe();
        if (authRes.authenticated) {
          setIsAdminAuthenticated(true);
        }
      } catch (err) {
        console.error('Initial DB load error:', err);
      }
    };

    initData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ef_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('ef_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const setLang = (l: Language) => {
    setLangState(l);
  };

  const setCurrentPage = (page: PageRoute) => {
    setCurrentPageRaw(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = async () => {
    await logoutAdmin();
    setIsAdminAuthenticated(false);
    if (currentPage === 'admin') {
      setCurrentPage('admin-login');
    }
  };

  const addToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // PRODUCTS CRUD
  const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    try {
      const created = await createProductApi(productData);
      setProducts((prev) => [created, ...prev]);
      const msg = lang === 'ar' ? 'تمت إضافة المنتج بنجاح' : 'Produit ajouté avec succès';
      addToast(msg, 'success');
      return created;
    } catch (err: any) {
      addToast(err.message || 'Erreur lors de l ajout du produit', 'warning');
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updated = await updateProductApi(id, productData);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      const msg = lang === 'ar' ? 'تم تحديث المنتج بنجاح' : 'Produit mis à jour avec succès';
      addToast(msg, 'info');
    } catch (err: any) {
      addToast(err.message || 'Erreur mise à jour produit', 'warning');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      const msg = lang === 'ar' ? 'تم حذف المنتج بنجاح' : 'Produit supprimé avec succès';
      addToast(msg, 'warning');
    } catch (err: any) {
      addToast(err.message || 'Erreur suppression produit', 'warning');
      throw err;
    }
  };

  const addProductAdmin = (product: Product) => {
    addProduct(product);
  };

  // CATEGORIES CRUD
  const addCategory = async (categoryData: Partial<Category>): Promise<Category> => {
    try {
      const created = await createCategoryApi(categoryData);
      setCategories((prev) => [...prev, created]);
      const msg = lang === 'ar' ? 'تمت إضافة الفئة بنجاح' : 'Catégorie ajoutée avec succès';
      addToast(msg, 'success');
      return created;
    } catch (err: any) {
      addToast('Erreur ajout catégorie', 'warning');
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const updated = await updateCategoryApi(id, categoryData);
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      const msg = lang === 'ar' ? 'تم تحديث الفئة بنجاح' : 'Catégorie mise à jour avec succès';
      addToast(msg, 'info');
    } catch (err: any) {
      addToast('Erreur modification catégorie', 'warning');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteCategoryApi(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      const msg = lang === 'ar' ? 'تم حذف الفئة بنجاح' : 'Catégorie supprimée avec succès';
      addToast(msg, 'warning');
    } catch (err: any) {
      addToast('Erreur suppression catégorie', 'warning');
      throw err;
    }
  };

  // BRANDS CRUD
  const addBrand = async (brandData: Partial<Brand>): Promise<Brand> => {
    try {
      const created = await createBrandApi(brandData);
      setBrands((prev) => [...prev, created]);
      const msg = lang === 'ar' ? 'تمت إضافة الماركة بنجاح' : 'Marque ajoutée avec succès';
      addToast(msg, 'success');
      return created;
    } catch (err: any) {
      addToast('Erreur ajout marque', 'warning');
      throw err;
    }
  };

  const updateBrand = async (id: string, brandData: Partial<Brand>) => {
    try {
      const updated = await updateBrandApi(id, brandData);
      setBrands((prev) => prev.map((b) => (b.id === id ? updated : b)));
      const msg = lang === 'ar' ? 'تم تحديث الماركة بنجاح' : 'Marque mise à jour avec succès';
      addToast(msg, 'info');
    } catch (err: any) {
      addToast('Erreur modification marque', 'warning');
      throw err;
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      await deleteBrandApi(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
      const msg = lang === 'ar' ? 'تم حذف الماركة بنجاح' : 'Marque supprimée avec succès';
      addToast(msg, 'warning');
    } catch (err: any) {
      addToast('Erreur suppression marque', 'warning');
      throw err;
    }
  };

  // PROMOTIONS CRUD
  const addPromotion = async (promoData: Partial<Promotion>): Promise<Promotion> => {
    try {
      const created = await createPromotionApi(promoData);
      setPromotions((prev) => [created, ...prev]);
      // Refresh products to show promo update
      fetchProductsApi().then(setProducts).catch(() => {});
      const msg = lang === 'ar' ? 'تمت إضافة التخفيض بنجاح' : 'Promotion ajoutée avec succès';
      addToast(msg, 'success');
      return created;
    } catch (err: any) {
      addToast('Erreur ajout promotion', 'warning');
      throw err;
    }
  };

  const updatePromotion = async (id: string, promoData: Partial<Promotion>) => {
    try {
      const updated = await updatePromotionApi(id, promoData);
      setPromotions((prev) => prev.map((pr) => (pr.id === id ? updated : pr)));
      fetchProductsApi().then(setProducts).catch(() => {});
      const msg = lang === 'ar' ? 'تم تحديث التخفيض بنجاح' : 'Promotion mise à jour avec succès';
      addToast(msg, 'info');
    } catch (err: any) {
      addToast('Erreur modification promotion', 'warning');
      throw err;
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      await deletePromotionApi(id);
      setPromotions((prev) => prev.filter((pr) => pr.id !== id));
      const msg = lang === 'ar' ? 'تم حذف التخفيض بنجاح' : 'Promotion supprimée avec succès';
      addToast(msg, 'warning');
    } catch (err: any) {
      addToast('Erreur suppression promotion', 'warning');
      throw err;
    }
  };

  // PACKS CRUD
  const addPack = async (packData: Partial<Pack>): Promise<Pack> => {
    try {
      const created = await createPackApi(packData);
      setPacks((prev) => [created, ...prev]);
      const msg = lang === 'ar' ? 'تمت إضافة الباقة بنجاح' : 'Pack ajouté avec succès';
      addToast(msg, 'success');
      return created;
    } catch (err: any) {
      addToast('Erreur ajout pack', 'warning');
      throw err;
    }
  };

  const updatePack = async (id: string, packData: Partial<Pack>) => {
    try {
      const updated = await updatePackApi(id, packData);
      setPacks((prev) => prev.map((pk) => (pk.id === id ? updated : pk)));
      const msg = lang === 'ar' ? 'تم تحديث الباقة بنجاح' : 'Pack mis à jour avec succès';
      addToast(msg, 'info');
    } catch (err: any) {
      addToast('Erreur modification pack', 'warning');
      throw err;
    }
  };

  const deletePack = async (id: string) => {
    try {
      await deletePackApi(id);
      setPacks((prev) => prev.filter((pk) => pk.id !== id));
      const msg = lang === 'ar' ? 'تم حذف الباقة بنجاح' : 'Pack supprimé avec succès';
      addToast(msg, 'warning');
    } catch (err: any) {
      addToast('Erreur suppression pack', 'warning');
      throw err;
    }
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, quantity }];
    });

    const msg = lang === 'ar'
      ? `تمت إضافة "${product.name.ar}" إلى السلة`
      : `"${product.name.fr}" ajouté au panier`;
    addToast(msg, 'success');
  };

  const addPackToCart = (pack: Pack) => {
    if (pack.products && pack.products.length > 0) {
      pack.products.forEach((prod) => {
        addToCart(prod, 1);
      });
    } else {
      const virtualProduct: Product = {
        id: pack.id,
        slug: pack.slug,
        reference: pack.reference || pack.id,
        name: pack.name,
        brand: 'ELECTRO_FENNASSA',
        categoryId: 'gros-electromenager',
        category: 'gros-electromenager',
        description: pack.description,
        technicalSpecifications: [],
        specifications: [],
        price: pack.packPrice,
        oldPrice: pack.normalPrice,
        warranty: 'Garantie Pack',
        color: { fr: 'Multicolore', ar: 'متعدد الألوان' },
        isActive: true,
        createdAt: pack.createdAt,
        updatedAt: pack.updatedAt,
        mainImage: pack.image,
        images: [pack.image],
      };
      addToCart(virtualProduct, 1);
    }

    const msg = lang === 'ar'
      ? `تمت إضافة عناصر الباقة "${pack.name.ar}" إلى السلة`
      : `Les produits du pack "${pack.name.fr}" ont été ajoutés au panier`;
    addToast(msg, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Submit order to API DB
  const submitOrder = async (customerData: {
    fullName: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    notes?: string;
  }): Promise<Order> => {
    const itemsPayload = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name[lang] || item.product.name.fr,
      productReference: item.product.reference,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const createdOrder = await submitOrderApi({
      ...customerData,
      city: 'Taourirt',
      items: itemsPayload,
    });

    setCurrentOrder(createdOrder);
    setOrders((prev) => [createdOrder, ...prev]);
    clearCart();
    setCurrentPage('confirmation');
    return createdOrder;
  };

  // Refresh admin tables
  const refreshOrders = async () => {
    try {
      const data = await fetchOrdersApi();
      setOrders(data);
    } catch (e) {
      console.error(e);
    }
  };

  const refreshCustomers = async () => {
    try {
      const data = await fetchCustomersApi();
      setCustomers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const refreshStats = async () => {
    try {
      const data = await fetchDashboardStatsApi();
      setDashboardStats(data);
    } catch (e) {
      console.error(e);
    }
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatusApi(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id || o.orderNumber === id ? updatedOrder : o)));
      if (currentOrder && (currentOrder.id === id || currentOrder.orderNumber === id)) {
        setCurrentOrder(updatedOrder);
      }
      const msg = lang === 'ar' ? 'تم تحديث حالة الطلب بنجاح' : 'Statut de la commande mis à jour';
      addToast(msg, 'info');
      refreshStats();
    } catch (err: any) {
      addToast(err.message || 'Erreur mise à jour statut', 'warning');
      throw err;
    }
  };

  const t = TRANSLATIONS[lang];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        t,
        currentPage,
        setCurrentPage,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        selectedProduct,
        setSelectedProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        brands,
        addBrand,
        updateBrand,
        deleteBrand,
        promotions,
        addPromotion,
        updatePromotion,
        deletePromotion,
        packs,
        addPack,
        updatePack,
        deletePack,
        selectedPack,
        setSelectedPack,
        cart,
        addToCart,
        addPackToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedSubCategoryFilter,
        setSelectedSubCategoryFilter,
        selectedBrandFilter,
        setSelectedBrandFilter,
        priceMinFilter,
        setPriceMinFilter,
        priceMaxFilter,
        setPriceMaxFilter,
        onlyPromotionsFilter,
        setOnlyPromotionsFilter,
        onlyNewFilter,
        setOnlyNewFilter,
        orders,
        customers,
        dashboardStats,
        submitOrder,
        updateOrderStatus,
        currentOrder,
        setCurrentOrder,
        refreshOrders,
        refreshCustomers,
        refreshStats,
        toasts,
        addToast,
        removeToast,
        wishlist,
        toggleWishlist,
        isInWishlist,
        recentlyViewed,
        addRecentlyViewed,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,
        deliveryConfig,
        updateDeliveryConfig,
        addProductAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
