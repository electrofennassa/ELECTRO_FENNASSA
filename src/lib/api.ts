import {
  Product,
  Category,
  Brand,
  Promotion,
  Pack,
  Order,
  OrderStatus,
  CustomerRecord,
  DashboardStats,
} from '../types';

const AUTH_TOKEN_KEY = 'ef_admin_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function getHeaders(isAuthRequired = false): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Authentication API
export async function loginAdmin(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur d authentification');
  }
  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function checkAuthMe() {
  const token = getAuthToken();
  if (!token) return { authenticated: false };

  try {
    const res = await fetch('/api/auth/me', {
      headers: getHeaders(true),
    });
    if (!res.ok) return { authenticated: false };
    return await res.json();
  } catch {
    return { authenticated: false };
  }
}

export async function logoutAdmin() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getHeaders(true),
    });
  } catch {
    // ignore
  } finally {
    removeAuthToken();
  }
}

// Products API
export async function fetchProductsApi(): Promise<Product[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Erreur chargement des produits');
  return res.json();
}

export async function createProductApi(productData: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur création produit');
  }
  return res.json();
}

export async function updateProductApi(id: string, productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Erreur modification produit');
  }
  return res.json();
}

export async function deleteProductApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  return res.ok;
}

// Categories API
export async function fetchCategoriesApi(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Erreur chargement catégories');
  return res.json();
}

export async function createCategoryApi(categoryData: Partial<Category>): Promise<Category> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(categoryData),
  });
  return res.json();
}

export async function updateCategoryApi(id: string, categoryData: Partial<Category>): Promise<Category> {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(categoryData),
  });
  return res.json();
}

export async function deleteCategoryApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  return res.ok;
}

// Brands API
export async function fetchBrandsApi(): Promise<Brand[]> {
  const res = await fetch('/api/brands');
  if (!res.ok) throw new Error('Erreur chargement marques');
  return res.json();
}

export async function createBrandApi(brandData: Partial<Brand>): Promise<Brand> {
  const res = await fetch('/api/brands', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(brandData),
  });
  return res.json();
}

export async function updateBrandApi(id: string, brandData: Partial<Brand>): Promise<Brand> {
  const res = await fetch(`/api/brands/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(brandData),
  });
  return res.json();
}

export async function deleteBrandApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/brands/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  return res.ok;
}

// Promotions API
export async function fetchPromotionsApi(): Promise<Promotion[]> {
  const res = await fetch('/api/promotions');
  if (!res.ok) throw new Error('Erreur chargement promotions');
  return res.json();
}

export async function createPromotionApi(promoData: Partial<Promotion>): Promise<Promotion> {
  const res = await fetch('/api/promotions', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(promoData),
  });
  return res.json();
}

export async function updatePromotionApi(id: string, promoData: Partial<Promotion>): Promise<Promotion> {
  const res = await fetch(`/api/promotions/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(promoData),
  });
  return res.json();
}

export async function deletePromotionApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/promotions/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  return res.ok;
}

// Packs API
export async function fetchPacksApi(): Promise<Pack[]> {
  const res = await fetch('/api/packs');
  if (!res.ok) throw new Error('Erreur chargement packs');
  return res.json();
}

export async function createPackApi(packData: Partial<Pack>): Promise<Pack> {
  const res = await fetch('/api/packs', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(packData),
  });
  return res.json();
}

export async function updatePackApi(id: string, packData: Partial<Pack>): Promise<Pack> {
  const res = await fetch(`/api/packs/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(packData),
  });
  return res.json();
}

export async function deletePackApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/packs/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  return res.ok;
}

// Orders API
export async function submitOrderApi(payload: {
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
}): Promise<Order> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la validation de la commande');
  }
  return data.order;
}

export async function fetchOrdersApi(): Promise<Order[]> {
  const res = await fetch('/api/orders', {
    headers: getHeaders(true),
  });
  if (!res.ok) throw new Error('Erreur chargement des commandes');
  return res.json();
}

export async function updateOrderStatusApi(id: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur modification statut commande');
  }
  return data.order;
}

// Customers API
export async function fetchCustomersApi(): Promise<CustomerRecord[]> {
  const res = await fetch('/api/customers', {
    headers: getHeaders(true),
  });
  if (!res.ok) throw new Error('Erreur chargement des clients');
  return res.json();
}

export async function fetchCustomerDetailApi(id: string): Promise<{ customer: CustomerRecord; orders: Order[] }> {
  const res = await fetch(`/api/customers/${id}`, {
    headers: getHeaders(true),
  });
  if (!res.ok) throw new Error('Erreur chargement détail client');
  return res.json();
}

// Stats API
export async function fetchDashboardStatsApi(): Promise<DashboardStats> {
  const res = await fetch('/api/stats', {
    headers: getHeaders(true),
  });
  if (!res.ok) throw new Error('Erreur chargement statistiques');
  return res.json();
}
