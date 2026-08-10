import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdminLoginPage } from './AdminLoginPage';
import {
  Product,
  Category,
  Brand,
  Promotion,
  Pack,
  Order,
  OrderStatus,
  CustomerRecord,
} from '../types';
import {
  Package,
  ShoppingBag,
  Clock,
  Phone,
  Tag,
  FolderTree,
  Award,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Search,
  Plus,
  AlertTriangle,
  Boxes,
  Users,
  LayoutDashboard,
  LogOut,
  Eye,
  Calendar,
  Check,
  TrendingUp,
  MapPin,
  FileText,
  DollarSign,
  Truck,
  ShieldCheck,
  Warehouse,
  Settings,
  Upload,
  Save,
  Image as ImageIcon,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    lang,
    t,
    isAdminAuthenticated,
    logout,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
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
    orders,
    customers,
    dashboardStats,
    updateOrderStatus,
    refreshOrders,
    refreshCustomers,
    refreshStats,
  } = useApp();

  // Selected Admin Tab
  const [adminTab, setAdminTab] = useState<
    'dashboard' | 'orders' | 'customers' | 'products' | 'categories' | 'brands' | 'promotions' | 'packs' | 'stock' | 'settings'
  >('dashboard');

  // Load latest admin data on mount or tab change
  useEffect(() => {
    if (isAdminAuthenticated) {
      refreshOrders();
      refreshCustomers();
      refreshStats();
    }
  }, [isAdminAuthenticated, adminTab]);

  // Order Filters & Search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Customer Filters & Modal
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  // Product Search & Filter
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminCatFilter, setAdminCatFilter] = useState('all');

  // Modals state for PRODUCTS
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: { fr: '', ar: '' },
    reference: '',
    brandId: 'brand-samsung',
    brand: 'Samsung',
    categoryId: 'gros-electromenager',
    category: 'gros-electromenager',
    subCategoryId: 'refrigerateurs',
    subCategory: 'refrigerateurs',
    description: { fr: '', ar: '' },
    price: 0,
    oldPrice: undefined,
    warranty: '2 ans Garantie',
    dimensions: '',
    color: { fr: 'Inox', ar: 'إينوكس' },
    power: '',
    isNew: true,
    isPromotion: false,
    isActive: true,
    mainImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
    technicalSpecifications: [],
  });

  // Modals state for CATEGORIES
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    name: { fr: '', ar: '' },
    slug: '',
    description: { fr: '', ar: '' },
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    isActive: true,
  });

  // Modals state for BRANDS
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [brandForm, setBrandForm] = useState<Partial<Brand>>({
    name: '',
    slug: '',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80',
    description: { fr: '', ar: '' },
    isActive: true,
  });

  // Modals state for PROMOTIONS
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [promotionForm, setPromotionForm] = useState<Partial<Promotion>>({
    productId: '',
    title: { fr: '', ar: '' },
    oldPrice: 0,
    newPrice: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    isActive: true,
  });

  // Modals state for PACKS
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [packForm, setPackForm] = useState<Partial<Pack>>({
    name: { fr: '', ar: '' },
    reference: '',
    description: { fr: '', ar: '' },
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    normalPrice: 0,
    packPrice: 0,
    isActive: true,
    badge: { fr: 'PACK ÉCONOMIQUE', ar: 'باك اقتصادي' },
    packProducts: [],
  });

  // Delete Confirmation Alert
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'product' | 'category' | 'brand' | 'promotion' | 'pack' | 'cancel-order';
    id: string;
    name: string;
  }>({
    isOpen: false,
    type: 'product',
    id: '',
    name: '',
  });

  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  // --- PRODUCT HANDLERS ---
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: { fr: '', ar: '' },
      reference: `REF-${Math.floor(Math.random() * 9000 + 1000)}`,
      brandId: brands[0]?.id || 'brand-samsung',
      brand: brands[0]?.name || 'Samsung',
      categoryId: 'gros-electromenager',
      category: 'gros-electromenager',
      subCategoryId: 'refrigerateurs',
      subCategory: 'refrigerateurs',
      description: { fr: '', ar: '' },
      price: 0,
      oldPrice: undefined,
      stock: 10,
      warranty: '2 ans Garantie',
      dimensions: '',
      color: { fr: 'Inox', ar: 'إينوكس' },
      power: '',
      isNew: true,
      isPromotion: false,
      isActive: true,
      mainImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
      technicalSpecifications: [
        { label: { fr: 'Marque', ar: 'الماركة' }, value: { fr: 'Samsung', ar: 'سامسونج' } },
        { label: { fr: 'Garantie', ar: 'الضمان' }, value: { fr: '2 ans', ar: 'سنتان' } },
      ],
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name?.fr || !productForm.price) return;

    if (editingProductId) {
      await updateProduct(editingProductId, productForm);
    } else {
      await addProduct(productForm);
    }
    setIsProductModalOpen(false);
  };

  // --- CATEGORY HANDLERS ---
  const handleOpenNewCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm({
      name: { fr: '', ar: '' },
      slug: '',
      description: { fr: '', ar: '' },
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({ ...cat });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name?.fr) return;
    if (editingCategoryId) {
      await updateCategory(editingCategoryId, categoryForm);
    } else {
      await addCategory(categoryForm);
    }
    setIsCategoryModalOpen(false);
  };

  // --- BRAND HANDLERS ---
  const handleOpenNewBrand = () => {
    setEditingBrandId(null);
    setBrandForm({
      name: '',
      slug: '',
      logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80',
      description: { fr: '', ar: '' },
      isActive: true,
    });
    setIsBrandModalOpen(true);
  };

  const handleEditBrand = (b: Brand) => {
    setEditingBrandId(b.id);
    setBrandForm({ ...b });
    setIsBrandModalOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name) return;
    if (editingBrandId) {
      await updateBrand(editingBrandId, brandForm);
    } else {
      await addBrand(brandForm);
    }
    setIsBrandModalOpen(false);
  };

  // --- PROMOTION HANDLERS ---
  const handleOpenNewPromotion = () => {
    setEditingPromotionId(null);
    const firstProd = products[0];
    setPromotionForm({
      productId: firstProd?.id || '',
      title: { fr: `Promo sur ${firstProd?.name.fr || 'Produit'}`, ar: `تخفيض على ${firstProd?.name.ar || 'المنتج'}` },
      oldPrice: firstProd?.oldPrice || (firstProd?.price ? firstProd.price + 500 : 3000),
      newPrice: firstProd?.price || 2500,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      isActive: true,
    });
    setIsPromotionModalOpen(true);
  };

  const handleEditPromotion = (pr: Promotion) => {
    setEditingPromotionId(pr.id);
    setPromotionForm({ ...pr });
    setIsPromotionModalOpen(true);
  };

  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promotionForm.newPrice) return;
    if (editingPromotionId) {
      await updatePromotion(editingPromotionId, promotionForm);
    } else {
      await addPromotion(promotionForm);
    }
    setIsPromotionModalOpen(false);
  };

  // --- PACK HANDLERS ---
  const handleOpenNewPack = () => {
    setEditingPackId(null);
    setPackForm({
      name: { fr: '', ar: '' },
      reference: `PACK-${Math.floor(Math.random() * 900 + 100)}`,
      description: { fr: '', ar: '' },
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      normalPrice: 10000,
      packPrice: 8900,
      isActive: true,
      badge: { fr: 'OFFRE SPÉCIALE TAOURIRT', ar: 'عرض خاص بتاوريرت' },
      packProducts: products.slice(0, 3).map((p) => ({ productId: p.id, quantity: 1 })),
      products: products.slice(0, 3),
    });
    setIsPackModalOpen(true);
  };

  const handleEditPack = (pk: Pack) => {
    setEditingPackId(pk.id);
    setPackForm({ ...pk });
    setIsPackModalOpen(true);
  };

  const handleSavePack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packForm.name?.fr || !packForm.packPrice) return;
    if (editingPackId) {
      await updatePack(editingPackId, packForm);
    } else {
      await addPack(packForm);
    }
    setIsPackModalOpen(false);
  };

  // --- DELETE CONFIRMATION HANDLER ---
  const handleConfirmDelete = async () => {
    if (deleteConfirm.type === 'product') {
      await deleteProduct(deleteConfirm.id);
    } else if (deleteConfirm.type === 'category') {
      await deleteCategory(deleteConfirm.id);
    } else if (deleteConfirm.type === 'brand') {
      await deleteBrand(deleteConfirm.id);
    } else if (deleteConfirm.type === 'promotion') {
      await deletePromotion(deleteConfirm.id);
    } else if (deleteConfirm.type === 'pack') {
      await deletePack(deleteConfirm.id);
    } else if (deleteConfirm.type === 'cancel-order') {
      await updateOrderStatus(deleteConfirm.id, 'Annulée');
    }
    setDeleteConfirm({ isOpen: false, type: 'product', id: '', name: '' });
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
      return false;
    }
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const num = (o.orderNumber || o.id).toLowerCase();
      const name = o.customerName.toLowerCase();
      const phone = o.customerPhone.toLowerCase();
      return num.includes(q) || name.includes(q) || phone.includes(q);
    }
    return true;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    if (!customerSearch.trim()) return true;
    const q = customerSearch.toLowerCase();
    return c.fullName.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q));
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (adminCatFilter !== 'all' && p.categoryId !== adminCatFilter && p.category !== adminCatFilter) {
      return false;
    }
    if (adminProductSearch.trim()) {
      const q = adminProductSearch.toLowerCase();
      const name = (p.name.fr + p.name.ar).toLowerCase();
      const ref = p.reference.toLowerCase();
      const brand = p.brand.toLowerCase();
      return name.includes(q) || ref.includes(q) || brand.includes(q);
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Nouvelle':
      case 'en_attente':
        return <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-[10px]">Nouvelle</span>;
      case 'Confirmée':
        return <span className="bg-blue-100 text-blue-900 font-bold px-2.5 py-1 rounded-full text-[10px]">Confirmée</span>;
      case 'En préparation':
        return <span className="bg-indigo-100 text-indigo-900 font-bold px-2.5 py-1 rounded-full text-[10px]">En préparation</span>;
      case 'En livraison':
        return <span className="bg-purple-100 text-purple-900 font-bold px-2.5 py-1 rounded-full text-[10px]">En livraison</span>;
      case 'Livrée':
        return <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-1 rounded-full text-[10px]">Livrée</span>;
      case 'Annulée':
        return <span className="bg-rose-100 text-rose-900 font-bold px-2.5 py-1 rounded-full text-[10px]">Annulée</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-full text-[10px]">{status}</span>;
    }
  };

  if (!isAdminAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner Header with Logout */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-400 bg-blue-950 border border-blue-800 px-3 py-1 rounded-full uppercase tracking-wider">
              GESTION STORE • TAOURIRT
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Connecté Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Tableau de Bord ELECTRO_FENNASSA
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Gestion intégrée des commandes, clients, produits, promotions et packs à Taourirt.
          </p>
        </div>

        <button
          onClick={() => logout()}
          className="bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/30 px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all self-start md:self-center shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Main Admin Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setAdminTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'dashboard'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-blue-400" />
          <span>Vue d ensemble</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-white" />
          <span>Commandes ({orders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('customers')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'customers'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Clients ({customers.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('products')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'products'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4 text-amber-400" />
          <span>Produits ({products.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('categories')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'categories'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FolderTree className="w-4 h-4 text-indigo-400" />
          <span>Catégories ({categories.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('brands')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'brands'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" />
          <span>Marques ({brands.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('promotions')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'promotions'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4 text-rose-400" />
          <span>Promotions ({promotions.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('packs')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'packs'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4 text-teal-400" />
          <span>Packs ({packs.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('stock')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'stock'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Warehouse className="w-4 h-4 text-emerald-400" />
          <span>Stock ({products.reduce((acc, p) => acc + (p.stock ?? 10), 0)} u.)</span>
        </button>

        <button
          onClick={() => setAdminTab('settings')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shrink-0 ${
            adminTab === 'settings'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Paramètres</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: DASHBOARD STATS */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Revenue & Orders KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Today */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Aujourd hui
              </span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-900">
                  {dashboardStats?.revenue.today.toLocaleString('fr-FR') || 0} DH
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {dashboardStats?.orders.today || 0} commandes
                </span>
              </div>
            </div>

            {/* This Week */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Cette Semaine
              </span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-slate-900">
                  {dashboardStats?.revenue.thisWeek.toLocaleString('fr-FR') || 0} DH
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {dashboardStats?.orders.thisWeek || 0} commandes
                </span>
              </div>
            </div>

            {/* This Month */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Ce Mois-ci
              </span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-black text-emerald-600">
                  {dashboardStats?.revenue.thisMonth.toLocaleString('fr-FR') || 0} DH
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {dashboardStats?.orders.thisMonth || 0} commandes
                </span>
              </div>
            </div>
          </div>

          {/* Status Breakdown & Catalog Counters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left 7 cols: Status breakdown */}
            <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>Répartition des Commandes par Statut</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 block">Nouvelles</span>
                  <span className="text-xl font-black text-amber-950">
                    {(dashboardStats?.statusCounts?.Nouvelle || 0) + (dashboardStats?.statusCounts?.en_attente || 0)}
                  </span>
                </div>

                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-800 block">Confirmées</span>
                  <span className="text-xl font-black text-blue-950">
                    {dashboardStats?.statusCounts?.Confirmée || 0}
                  </span>
                </div>

                <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200">
                  <span className="text-[11px] font-bold text-indigo-800 block">En Préparation</span>
                  <span className="text-xl font-black text-indigo-950">
                    {dashboardStats?.statusCounts?.['En préparation'] || 0}
                  </span>
                </div>

                <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200">
                  <span className="text-[11px] font-bold text-purple-800 block">En Livraison</span>
                  <span className="text-xl font-black text-purple-950">
                    {dashboardStats?.statusCounts?.['En livraison'] || 0}
                  </span>
                </div>

                <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 block">Livrées</span>
                  <span className="text-xl font-black text-emerald-950">
                    {dashboardStats?.statusCounts?.Livrée || 0}
                  </span>
                </div>

                <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200">
                  <span className="text-[11px] font-bold text-rose-800 block">Annulées</span>
                  <span className="text-xl font-black text-rose-950">
                    {dashboardStats?.statusCounts?.Annulée || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Catalog Summary */}
            <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Aperçu du Catalogue</span>
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Nombre de Produits</span>
                  <span className="font-bold text-slate-900">{products.length}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Nombre de Catégories</span>
                  <span className="font-bold text-slate-900">{categories.length}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Marques référencées</span>
                  <span className="font-bold text-slate-900">{brands.length}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Promotions actives</span>
                  <span className="font-bold text-rose-600">{promotions.length}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Packs disponibles</span>
                  <span className="font-bold text-amber-600">{packs.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: ORDERS TABLE & DETAIL MODAL */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Gestion des Commandes ({orders.length})
              </h2>
              <p className="text-xs text-slate-500">
                Consultez, filtrez et modifiez l état d avancement des commandes à Taourirt.
              </p>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Rechercher par N° commande, nom client ou téléphone..."
                className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="bg-slate-50 text-slate-900 text-xs px-3 py-3 rounded-xl border border-slate-200 font-bold"
            >
              <option value="all">Tous les statuts</option>
              <option value="Nouvelle">Nouvelle</option>
              <option value="Confirmée">Confirmée</option>
              <option value="En préparation">En préparation</option>
              <option value="En livraison">En livraison</option>
              <option value="Livrée">Livrée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>

          {/* Table of Orders */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Numéro</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Téléphone</th>
                  <th className="py-3 px-2">Ville</th>
                  <th className="py-3 px-2 text-right">Total</th>
                  <th className="py-3 px-2 text-center">Statut</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-2 font-mono font-bold text-blue-700">
                        {ord.orderNumber || `#${ord.id}`}
                      </td>
                      <td className="py-3.5 px-2 text-slate-500">
                        {new Date(ord.createdAt || ord.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-2 font-bold text-slate-900">
                        {ord.customerName || ord.customer.fullName}
                      </td>
                      <td className="py-3.5 px-2 text-slate-700 font-mono" dir="ltr">
                        {ord.customerPhone || ord.customer.phone}
                      </td>
                      <td className="py-3.5 px-2 text-slate-600 font-semibold">
                        {ord.city || 'Taourirt'}
                      </td>
                      <td className="py-3.5 px-2 text-right font-black text-slate-900">
                        {(ord.total || ord.totalAmount || 0).toLocaleString('fr-FR')} DH
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        {getStatusBadge(ord.status)}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Détails</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Aucune commande ne correspond aux filtres.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: CUSTOMERS TABLE & HISTORY MODAL */}
      {/* ------------------------------------------------------------- */}
      {adminTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Fichier Clients Reçus ({customers.length})
              </h2>
              <p className="text-xs text-slate-500">
                Historique d achats et coordonnées des clients sur Taourirt.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder="Rechercher un client par nom ou téléphone..."
              className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          {/* Table of Customers */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Nom Complet</th>
                  <th className="py-3 px-2">Téléphone</th>
                  <th className="py-3 px-2">Ville</th>
                  <th className="py-3 px-2">Commandes</th>
                  <th className="py-3 px-2 text-right">Total Dépensé</th>
                  <th className="py-3 px-2">Dernière Commande</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-slate-900">{cust.fullName}</td>
                      <td className="py-3.5 px-2 text-slate-700 font-mono" dir="ltr">{cust.phone}</td>
                      <td className="py-3.5 px-2 text-slate-600">{cust.city || 'Taourirt'}</td>
                      <td className="py-3.5 px-2 font-extrabold text-blue-700">{cust.totalOrders}</td>
                      <td className="py-3.5 px-2 text-right font-black text-slate-900">
                        {cust.totalSpent.toLocaleString('fr-FR')} DH
                      </td>
                      <td className="py-3.5 px-2 text-slate-500">
                        {new Date(cust.lastOrderDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all"
                        >
                          Fiche Client
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Aucun client trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PRODUCTS MANAGEMENT */}
      {adminTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Gestion des Produits ({products.length})
              </h2>
              <p className="text-xs text-slate-500">
                Ajoutez, modifiez ou supprimez les articles du catalogue.
              </p>
            </div>

            <button
              onClick={handleOpenNewProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addProduct}</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 relative">
              <input
                type="text"
                value={adminProductSearch}
                onChange={(e) => setAdminProductSearch(e.target.value)}
                placeholder="Rechercher par nom, référence ou marque..."
                className="w-full bg-slate-50 text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            <select
              value={adminCatFilter}
              onChange={(e) => setAdminCatFilter(e.target.value)}
              className="bg-slate-50 text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200 font-bold"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.fr}
                </option>
              ))}
            </select>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 p-2 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.mainImage}
                    alt={p.name.fr}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {p.reference}
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-700 uppercase">
                        {p.brand}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{p.name.fr}</h3>
                    <p className="text-[11px] text-slate-500 truncate max-w-md">{p.name.ar}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-base">
                      {p.price.toLocaleString('fr-FR')} DH
                    </span>
                    {p.oldPrice && p.oldPrice > p.price && (
                      <span className="block text-[10px] text-slate-400 line-through">
                        {p.oldPrice.toLocaleString('fr-FR')} DH
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditProduct(p)}
                      className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-xl transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          type: 'product',
                          id: p.id,
                          name: p.name.fr,
                        })
                      }
                      className="p-2 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORIES */}
      {adminTab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Catégories ({categories.length})</h2>
            </div>
            <button
              onClick={handleOpenNewCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Catégorie</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between shadow-xs hover:border-blue-300 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'}
                    alt={cat.name.fr}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200 bg-white shrink-0 shadow-xs"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{cat.name.fr}</h3>
                    <p className="text-xs text-slate-500 truncate" dir="rtl">{cat.name.ar || 'لا يوجد اسم بالعربية'}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                      {cat.slug || cat.id}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEditCategory(cat)}
                    className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors shadow-xs"
                    title="Modifier la catégorie"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({ isOpen: true, type: 'category', id: cat.id, name: cat.name.fr })
                    }
                    className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors shadow-xs"
                    title="Supprimer la catégorie"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: BRANDS */}
      {adminTab === 'brands' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Marques ({brands.length})</h2>
            </div>
            <button
              onClick={handleOpenNewBrand}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Marque</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {brands.map((b) => (
              <div key={b.id} className="bg-slate-50 rounded-2xl p-4 border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={b.logo} alt={b.name} className="w-10 h-10 object-contain rounded-xl bg-white p-1" />
                  <span className="font-bold text-slate-900">{b.name}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleEditBrand(b)} className="p-1.5 bg-white border rounded-lg">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirm({ isOpen: true, type: 'brand', id: b.id, name: b.name })
                    }
                    className="p-1.5 bg-white border rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: PROMOTIONS */}
      {adminTab === 'promotions' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Promotions ({promotions.length})</h2>
            </div>
            <button
              onClick={handleOpenNewPromotion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Promotion</span>
            </button>
          </div>

          <div className="space-y-3">
            {promotions.map((pr) => (
              <div key={pr.id} className="bg-slate-50 p-4 rounded-2xl border flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                    -{pr.discountPercentage}%
                  </span>
                  <h3 className="font-bold text-slate-900 mt-1">{pr.title.fr}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-slate-900">{pr.newPrice} DH</span>
                  <button onClick={() => handleEditPromotion(pr)} className="p-2 bg-white rounded-xl border">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: PACKS */}
      {adminTab === 'packs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Packs ({packs.length})</h2>
            </div>
            <button
              onClick={handleOpenNewPack}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Pack</span>
            </button>
          </div>

          <div className="space-y-3">
            {packs.map((pk) => (
              <div key={pk.id} className="bg-slate-50 p-4 rounded-2xl border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={pk.image} alt={pk.name.fr} className="w-12 h-12 object-cover rounded-xl" />
                  <div>
                    <h3 className="font-bold text-slate-900">{pk.name.fr}</h3>
                    <p className="text-xs text-slate-500">Prix Pack: {pk.packPrice} DH</p>
                  </div>
                </div>
                <button onClick={() => handleEditPack(pk)} className="p-2 bg-white rounded-xl border">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: STOCK MANAGEMENT */}
      {adminTab === 'stock' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Gestion des Stocks</h2>
              <p className="text-xs text-slate-500">
                Suivez et mettez à jour la quantité disponible en magasin pour chaque article.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> En stock: {products.filter((p) => (p.stock ?? 10) > 5).length}
              </span>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Stock faible: {products.filter((p) => (p.stock ?? 10) > 0 && (p.stock ?? 10) <= 5).length}
              </span>
              <span className="bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <X className="w-3.5 h-3.5" /> Rupture: {products.filter((p) => (p.stock ?? 10) === 0).length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Article</th>
                  <th className="py-3 px-2">Référence</th>
                  <th className="py-3 px-2">Marque</th>
                  <th className="py-3 px-2">Prix (DH)</th>
                  <th className="py-3 px-2 text-center">Quantité Stock</th>
                  <th className="py-3 px-2 text-center">Statut</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const currentStock = p.stock ?? 10;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img src={p.mainImage} alt={p.name.fr} className="w-10 h-10 object-cover rounded-xl border" />
                          <div>
                            <span className="font-bold text-slate-900 block">{p.name.fr}</span>
                            <span className="text-[10px] text-slate-400 block">{p.name.ar}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono font-bold text-blue-600">{p.reference}</td>
                      <td className="py-3 px-2 font-semibold text-slate-700">{p.brand}</td>
                      <td className="py-3 px-2 font-black text-slate-900">{p.price.toLocaleString('fr-FR')} DH</td>
                      <td className="py-3 px-2 text-center">
                        <div className="inline-flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                          <button
                            onClick={() => updateProduct(p.id, { stock: Math.max(0, currentStock - 1) })}
                            className="w-6 h-6 bg-white hover:bg-slate-200 font-bold rounded-lg text-slate-800 shadow-xs flex items-center justify-center text-sm"
                            title="Diminuer stock"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-slate-900 text-sm px-2">{currentStock}</span>
                          <button
                            onClick={() => updateProduct(p.id, { stock: currentStock + 1 })}
                            className="w-6 h-6 bg-white hover:bg-slate-200 font-bold rounded-lg text-slate-800 shadow-xs flex items-center justify-center text-sm"
                            title="Augmenter stock"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {currentStock > 5 ? (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">En Stock</span>
                        ) : currentStock > 0 ? (
                          <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px]">Stock Faible</span>
                        ) : (
                          <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-[10px]">Rupture</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all"
                        >
                          Éditer Produit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 10: PARAMÈTRES */}
      {adminTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div>
            <h2 className="text-xl font-black text-slate-900">Paramètres de l Administration</h2>
            <p className="text-xs text-slate-500 mt-1">
              Configuration du magasin ELECTRO_FENNASSA à Taourirt et état du système Supabase.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Store Information */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Informations Boutique Taourirt
              </h3>
              <div className="space-y-2 text-slate-700">
                <p><strong>Nom :</strong> ELECTRO_FENNASSA</p>
                <p><strong>Ville :</strong> Taourirt, Maroc</p>
                <p><strong>Adresse :</strong> Boulevard Hassan II, Taourirt</p>
                <p><strong>Téléphone :</strong> +212 600 000 000</p>
                <p><strong>WhatsApp :</strong> +212 600 000 000</p>
                <p><strong>Zone de livraison :</strong> Taourirt et régions environnantes</p>
              </div>
            </div>

            {/* Supabase Status */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Connexion Supabase Database
              </h3>
              <div className="space-y-2 text-slate-700">
                <p className="flex items-center gap-2">
                  <span>Base de Données:</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    Supabase PostgreSQL Connecté
                  </span>
                </p>
                <p><strong>Synchronisation :</strong> En temps réel (Produits, Catégories, Marques, Orders)</p>
                <p><strong>Persistance :</strong> Active après chaque modification</p>
                <p><strong>Sécurité :</strong> Accès restreint à l administration par mot de passe</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ORDER DETAIL MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {selectedOrder.orderNumber || `#${selectedOrder.id}`}
                </span>
                <h3 className="font-black text-slate-900 text-lg mt-1">
                  Détail de la Commande
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Status Action Buttons */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase block">
                Changer le Statut :
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'Confirmée')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                >
                  Confirmer
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'En préparation')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                >
                  Mettre en préparation
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'En livraison')}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                >
                  Expédier
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.id, 'Livrée')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                >
                  Marquer comme livrée
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirm({
                      isOpen: true,
                      type: 'cancel-order',
                      id: selectedOrder.id,
                      name: selectedOrder.orderNumber || selectedOrder.id,
                    });
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>

            {/* Client Info snippet */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900 text-sm">
                {selectedOrder.customerName || selectedOrder.customer.fullName}
              </p>
              <p className="text-slate-600">
                Téléphone: <strong dir="ltr">{selectedOrder.customerPhone || selectedOrder.customer.phone}</strong>
              </p>
              <p className="text-slate-600">
                Adresse: {selectedOrder.address || selectedOrder.customer.address}, {selectedOrder.city || 'Taourirt'}
              </p>
              {selectedOrder.notes && (
                <p className="text-amber-800 font-medium pt-1">Notes: {selectedOrder.notes}</p>
              )}
            </div>

            {/* Ordered Items */}
            <div className="divide-y divide-slate-100 text-xs">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{it.productName || it.name}</p>
                    <p className="text-slate-500">
                      Réf: {it.productReference || it.reference || 'N/A'} • Qté: {it.quantity}
                    </p>
                  </div>
                  <span className="font-black text-slate-900">
                    {((it.unitPrice || it.price) * it.quantity).toLocaleString('fr-FR')} DH
                  </span>
                </div>
              ))}

              <div className="pt-4 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Total Commande :</span>
                <span className="text-blue-700 text-lg">
                  {(selectedOrder.total || selectedOrder.totalAmount || 0).toLocaleString('fr-FR')} DH
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">Fiche Client</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-black text-slate-900 text-base">{selectedCustomer.fullName}</h4>
              <p className="text-slate-600">
                Téléphone: <strong dir="ltr">{selectedCustomer.phone}</strong>
              </p>
              <p className="text-slate-600">Adresse: {selectedCustomer.address}, {selectedCustomer.city}</p>
              <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-slate-800 font-bold">
                <div>Commandes: {selectedCustomer.totalOrders}</div>
                <div>Total Dépensé: {selectedCustomer.totalSpent.toLocaleString('fr-FR')} DH</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE / CANCEL CONFIRMATION MODAL */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-base">
              Confirmation obligatoire
            </h3>
            <p className="text-xs text-slate-600">
              Voulez-vous vraiment continuer pour : <strong>{deleteConfirm.name}</strong> ?
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, type: 'product', id: '', name: '' })}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-2.5 rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS FOR PRODUCT / CATEGORY / BRAND / PROMO / PACK CREATION */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">
                {editingProductId ? 'Modifier le Produit' : 'Ajouter un Produit'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom (Français) *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name?.fr || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: { fr: e.target.value, ar: productForm.name?.ar || '' } })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom (Arabe)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={productForm.name?.ar || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: { fr: productForm.name?.fr || '', ar: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Référence *</label>
                  <input
                    type="text"
                    required
                    value={productForm.reference || ''}
                    onChange={(e) => setProductForm({ ...productForm, reference: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marque *</label>
                  <select
                    value={productForm.brandId || brands[0]?.id}
                    onChange={(e) => {
                      const selBrand = brands.find((b) => b.id === e.target.value);
                      setProductForm({ ...productForm, brandId: e.target.value, brand: selBrand?.name || e.target.value });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie *</label>
                  <select
                    value={productForm.categoryId || 'gros-electromenager'}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name.fr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix Vente (DH) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.price || 0}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-black focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ancien Prix (DH)</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.oldPrice || ''}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Disponible *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock ?? 10}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image Principale (URL ou Fichier) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={productForm.mainImage || ''}
                    onChange={(e) => setProductForm({ ...productForm, mainImage: e.target.value, images: [e.target.value] })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl cursor-pointer font-bold text-xs shrink-0">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Importer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (reader.result) {
                              setProductForm({ ...productForm, mainImage: reader.result as string, images: [reader.result as string] });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {productForm.mainImage && (
                  <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <img src={productForm.mainImage} alt="Aperçu produit" className="w-12 h-12 object-cover rounded-lg border bg-white" />
                    <span className="text-slate-500 text-[11px] truncate">Aperçu du produit</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description (Français)</label>
                  <textarea
                    rows={3}
                    value={productForm.description?.fr || ''}
                    onChange={(e) => setProductForm({ ...productForm, description: { fr: e.target.value, ar: productForm.description?.ar || '' } })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description (Arabe)</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={productForm.description?.ar || ''}
                    onChange={(e) => setProductForm({ ...productForm, description: { fr: productForm.description?.fr || '', ar: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isActive ?? true}
                    onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-bold text-slate-800">Actif (Visible en boutique)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured ?? false}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-bold text-slate-800">Mettre En Vedette (Page d accueil)</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition-all mt-4"
              >
                Enregistrer dans la Base de Données Supabase
              </button>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl my-8 border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  {editingCategoryId ? 'Modifier la Catégorie' : 'Ajouter une Nouvelle Catégorie'}
                </h3>
                <p className="text-xs text-slate-500">Définissez le nom, la traduction et l'image de la catégorie</p>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom (Français) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Réfrigérateurs"
                    value={categoryForm.name?.fr || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: { fr: e.target.value, ar: categoryForm.name?.ar || '' } })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom (Arabe)</label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="مثال: ثلاجات"
                    value={categoryForm.name?.ar || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: { fr: categoryForm.name?.fr || '', ar: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              {/* IMAGE URL & UPLOAD FIELD */}
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-800 text-xs">
                  Image de la Catégorie (URL web ou Fichier local) *
                </label>

                {/* URL Input */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">Option A : Saisir ou coller une URL d'image</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={categoryForm.image || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-2.5 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* File Upload Button */}
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">Option B : Importer une image depuis votre téléphone ou PC</span>
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl cursor-pointer text-slate-800 font-bold text-xs transition-all shadow-xs">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Choisir un fichier image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (reader.result) {
                              setCategoryForm({ ...categoryForm, image: reader.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* PRESET IMAGES QUICK PICKER */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    Images suggérées Électroménager (cliquez pour appliquer) :
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                      { label: 'Réfrigérateur', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Lave-linge', url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Cuisinière', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Téléviseur', url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Climatiseur', url: 'https://images.unsplash.com/photo-1614633833026-062030018f67?auto=format&fit=crop&w=800&q=80' },
                      { label: 'Petit-Électro', url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80' },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, image: preset.url })}
                        className="shrink-0 flex flex-col items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-xs transition-all"
                      >
                        <img src={preset.url} alt={preset.label} className="w-12 h-12 object-cover rounded-lg" />
                        <span className="text-[9px] font-medium text-slate-700 truncate max-w-[65px]">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* LIVE IMAGE PREVIEW */}
                {categoryForm.image ? (
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                    <img
                      src={categoryForm.image}
                      alt="Aperçu"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 text-xs block">Aperçu direct de l'image</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[240px]">
                        {categoryForm.image.startsWith('data:') ? 'Image locale sélectionnée' : categoryForm.image}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description (Français)</label>
                  <textarea
                    rows={2}
                    placeholder="Description optionnelle..."
                    value={categoryForm.description?.fr || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: { fr: e.target.value, ar: categoryForm.description?.ar || '' } })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description (Arabe)</label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    placeholder="وصف اختياري..."
                    value={categoryForm.description?.ar || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: { fr: categoryForm.description?.fr || '', ar: e.target.value } })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la Catégorie</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-slate-900 text-base">
                {editingBrandId ? 'Modifier la Marque' : 'Ajouter une Marque'}
              </h3>
              <button onClick={() => setIsBrandModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveBrand} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nom de la Marque *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Samsung, LG, Whirlpool..."
                  value={brandForm.name || ''}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Logo / Image (URL ou Fichier) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={brandForm.logo || ''}
                    onChange={(e) => setBrandForm({ ...brandForm, logo: e.target.value })}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl cursor-pointer font-bold text-xs shrink-0">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Importer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (reader.result) {
                              setBrandForm({ ...brandForm, logo: reader.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              {brandForm.logo && (
                <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded-xl border">
                  <img src={brandForm.logo} alt="Aperçu logo" className="w-12 h-12 object-contain bg-white rounded-lg border p-1" />
                  <span className="text-slate-500 text-[11px] truncate">Aperçu du logo</span>
                </div>
              )}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                Enregistrer la Marque
              </button>
            </form>
          </div>
        </div>
      )}

      {isPromotionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-slate-900 text-base">
                {editingPromotionId ? 'Modifier la Promotion' : 'Ajouter une Promotion'}
              </h3>
              <button onClick={() => setIsPromotionModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSavePromotion} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nouveau Prix Promo (DH) *</label>
                <input
                  type="number"
                  required
                  value={promotionForm.newPrice || 0}
                  onChange={(e) => setPromotionForm({ ...promotionForm, newPrice: Number(e.target.value) })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                Enregistrer la Promotion
              </button>
            </form>
          </div>
        </div>
      )}

      {isPackModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-black text-slate-900 text-base">
                {editingPackId ? 'Modifier le Pack' : 'Ajouter un Pack'}
              </h3>
              <button onClick={() => setIsPackModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSavePack} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nom du Pack (Français) *</label>
                <input
                  type="text"
                  required
                  value={packForm.name?.fr || ''}
                  onChange={(e) => setPackForm({ ...packForm, name: { fr: e.target.value, ar: packForm.name?.ar || '' } })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Nom du Pack (Arabe)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={packForm.name?.ar || ''}
                  onChange={(e) => setPackForm({ ...packForm, name: { fr: packForm.name?.fr || '', ar: e.target.value } })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Image du Pack (URL ou Fichier) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={packForm.image || ''}
                    onChange={(e) => setPackForm({ ...packForm, image: e.target.value })}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl cursor-pointer font-bold text-xs shrink-0">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Importer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (reader.result) {
                              setPackForm({ ...packForm, image: reader.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              {packForm.image && (
                <div className="mt-2 flex items-center gap-3 bg-slate-50 p-2 rounded-xl border">
                  <img src={packForm.image} alt="Aperçu pack" className="w-12 h-12 object-cover rounded-lg border" />
                  <span className="text-slate-500 text-[11px] truncate">Aperçu du pack</span>
                </div>
              )}
              <div>
                <label className="block font-bold mb-1">Prix du Pack (DH) *</label>
                <input
                  type="number"
                  required
                  value={packForm.packPrice || 0}
                  onChange={(e) => setPackForm({ ...packForm, packPrice: Number(e.target.value) })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
                Enregistrer le Pack
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
