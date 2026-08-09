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

/**
 * Safely parses API responses, handling JSON, plain text, empty bodies, and HTML error pages.
 */
async function handleApiResponse<T = any>(res: Response, defaultError: string): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  let data: any = {};

  if (text && text.trim().length > 0) {
    if (contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }
    } else {
      // Strip HTML tags if server or cloud host returned an HTML error page
      const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);
      data = { error: cleanText || `Erreur serveur (${res.status})` };
    }
  }

  if (!res.ok) {
    const errorMsg = data?.error || data?.message || `${defaultError} (Code ${res.status})`;
    throw new Error(errorMsg);
  }

  return data as T;
}

// Authentication API
export async function loginAdmin(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const data = await handleApiResponse<{ success?: boolean; token?: string; user?: any }>(
    res,
    'Erreur d authentification'
  );

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
    return await handleApiResponse<{ authenticated: boolean; user?: any }>(res, 'Échec de vérification de session');
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
  return handleApiResponse<Product[]>(res, 'Erreur lors du chargement des produits');
}

export async function createProductApi(productData: Partial<Product>): Promise<Product> {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(productData),
  });
  return handleApiResponse<Product>(res, 'Erreur lors de la création du produit');
}

export async function updateProductApi(id: string, productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(productData),
  });
  return handleApiResponse<Product>(res, 'Erreur lors de la modification du produit');
}

export async function deleteProductApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  await handleApiResponse<{ success?: boolean }>(res, 'Erreur lors de la suppression du produit');
  return res.ok;
}

// Categories API
export async function fetchCategoriesApi(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  return handleApiResponse<Category[]>(res, 'Erreur lors du chargement des catégories');
}

export async function createCategoryApi(categoryData: Partial<Category>): Promise<Category> {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(categoryData),
  });
  return handleApiResponse<Category>(res, 'Erreur lors de la création de la catégorie');
}

export async function updateCategoryApi(id: string, categoryData: Partial<Category>): Promise<Category> {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(categoryData),
  });
  return handleApiResponse<Category>(res, 'Erreur lors de la modification de la catégorie');
}

export async function deleteCategoryApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  await handleApiResponse<{ success?: boolean }>(res, 'Erreur lors de la suppression de la catégorie');
  return res.ok;
}

// Brands API
export async function fetchBrandsApi(): Promise<Brand[]> {
  const res = await fetch('/api/brands');
  return handleApiResponse<Brand[]>(res, 'Erreur lors du chargement des marques');
}

export async function createBrandApi(brandData: Partial<Brand>): Promise<Brand> {
  const res = await fetch('/api/brands', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(brandData),
  });
  return handleApiResponse<Brand>(res, 'Erreur lors de la création de la marque');
}

export async function updateBrandApi(id: string, brandData: Partial<Brand>): Promise<Brand> {
  const res = await fetch(`/api/brands/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(brandData),
  });
  return handleApiResponse<Brand>(res, 'Erreur lors de la modification de la marque');
}

export async function deleteBrandApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/brands/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  await handleApiResponse<{ success?: boolean }>(res, 'Erreur lors de la suppression de la marque');
  return res.ok;
}

// Promotions API
export async function fetchPromotionsApi(): Promise<Promotion[]> {
  const res = await fetch('/api/promotions');
  return handleApiResponse<Promotion[]>(res, 'Erreur lors du chargement des promotions');
}

export async function createPromotionApi(promoData: Partial<Promotion>): Promise<Promotion> {
  const res = await fetch('/api/promotions', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(promoData),
  });
  return handleApiResponse<Promotion>(res, 'Erreur lors de la création de la promotion');
}

export async function updatePromotionApi(id: string, promoData: Partial<Promotion>): Promise<Promotion> {
  const res = await fetch(`/api/promotions/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(promoData),
  });
  return handleApiResponse<Promotion>(res, 'Erreur lors de la modification de la promotion');
}

export async function deletePromotionApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/promotions/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  await handleApiResponse<{ success?: boolean }>(res, 'Erreur lors de la suppression de la promotion');
  return res.ok;
}

// Packs API
export async function fetchPacksApi(): Promise<Pack[]> {
  const res = await fetch('/api/packs');
  return handleApiResponse<Pack[]>(res, 'Erreur lors du chargement des packs');
}

export async function createPackApi(packData: Partial<Pack>): Promise<Pack> {
  const res = await fetch('/api/packs', {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(packData),
  });
  return handleApiResponse<Pack>(res, 'Erreur lors de la création du pack');
}

export async function updatePackApi(id: string, packData: Partial<Pack>): Promise<Pack> {
  const res = await fetch(`/api/packs/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(packData),
  });
  return handleApiResponse<Pack>(res, 'Erreur lors de la modification du pack');
}

export async function deletePackApi(id: string): Promise<boolean> {
  const res = await fetch(`/api/packs/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  });
  await handleApiResponse<{ success?: boolean }>(res, 'Erreur lors de la suppression du pack');
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

  const data = await handleApiResponse<{ success?: boolean; order: Order }>(
    res,
    'Erreur lors de la validation de la commande'
  );
  return data.order;
}

export async function fetchOrdersApi(): Promise<Order[]> {
  const res = await fetch('/api/orders', {
    headers: getHeaders(true),
  });
  return handleApiResponse<Order[]>(res, 'Erreur lors du chargement des commandes');
}

export async function updateOrderStatusApi(id: string, status: OrderStatus): Promise<Order> {
  const res = await fetch(`/api/orders/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ status }),
  });

  const data = await handleApiResponse<{ success?: boolean; order: Order }>(
    res,
    'Erreur lors de la modification du statut de la commande'
  );
  return data.order;
}

// Customers API
export async function fetchCustomersApi(): Promise<CustomerRecord[]> {
  const res = await fetch('/api/customers', {
    headers: getHeaders(true),
  });
  return handleApiResponse<CustomerRecord[]>(res, 'Erreur lors du chargement des clients');
}

export async function fetchCustomerDetailApi(id: string): Promise<{ customer: CustomerRecord; orders: Order[] }> {
  const res = await fetch(`/api/customers/${id}`, {
    headers: getHeaders(true),
  });
  return handleApiResponse<{ customer: CustomerRecord; orders: Order[] }>(
    res,
    'Erreur lors du chargement du détail client'
  );
}

// Stats API
export async function fetchDashboardStatsApi(): Promise<DashboardStats> {
  const res = await fetch('/api/stats', {
    headers: getHeaders(true),
  });
  return handleApiResponse<DashboardStats>(res, 'Erreur lors du chargement des statistiques');
}
