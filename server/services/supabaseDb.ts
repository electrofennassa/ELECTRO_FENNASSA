import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import {
  Product,
  Category,
  Brand,
  Promotion,
  Pack,
  CustomerRecord,
  Order,
  OrderItem,
  OrderStatus,
  DashboardStats,
} from '../../src/types';

// ==========================================
// SUPABASE DATA SERVICE LAYER
// ==========================================

export const supabaseDb = {
  isAvailable(): boolean {
    return isSupabaseConfigured();
  },

  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    let { data, error } = await client.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase getProducts ordered query warning:', error);
      const res = await client.from('products').select('*');
      data = res.data;
      if (res.error) {
        console.error('Supabase getProducts error:', res.error);
        return [];
      }
    }

    return (data || []).map((p) => {
      const price = Number(p.price || 0);
      const oldPrice = p.old_price ? Number(p.old_price) : undefined;
      const specs = p.specifications && typeof p.specifications === 'object' && !Array.isArray(p.specifications)
        ? Object.entries(p.specifications).map(([k, v]) => ({ label: { fr: String(k), ar: String(k) }, value: { fr: String(v), ar: String(v) } }))
        : [];

      return {
        id: p.id,
        reference: p.reference || '',
        name: { fr: p.name_fr || '', ar: p.name_ar || '' },
        slug: p.slug || '',
        description: { fr: p.description_fr || '', ar: p.description_ar || '' },
        price,
        oldPrice,
        stock: p.stock !== undefined ? Number(p.stock) : 10,
        brandId: p.brand_id || 'brand-generic',
        brand: p.brand_id || 'Électroménager',
        categoryId: p.category_id || 'gros-electromenager',
        category: p.category_id || 'gros-electromenager',
        mainImage: p.main_image || '',
        images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.main_image || ''],
        technicalSpecifications: specs,
        specifications: specs,
        warranty: `${p.warranty_months || 12} Mois`,
        color: { fr: 'Inox', ar: 'إينوكس' },
        featured: Boolean(p.is_featured),
        isActive: Boolean(p.is_active),
        createdAt: p.created_at,
        updatedAt: p.updated_at || p.created_at,
      };
    });
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase Client non configuré.');

    const newId = product.id || `prod-${Date.now()}`;
    const row: any = {
      id: newId,
      reference: product.reference || `REF-${Date.now()}`,
      name_fr: product.name?.fr || 'Nouveau Produit',
      name_ar: product.name?.ar || 'منتج جديد',
      slug: product.slug || (product.name?.fr || 'produit').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description_fr: product.description?.fr || '',
      description_ar: product.description?.ar || '',
      price: product.price || 0,
      old_price: product.oldPrice || null,
      category_id: product.categoryId || null,
      brand_id: product.brandId || null,
      main_image: product.mainImage || '',
      images: product.images || [],
      specifications: product.specifications || {},
      warranty_months: 12,
      is_featured: product.featured ?? false,
      is_active: product.isActive ?? true,
    };

    const { data, error } = await client.from('products').insert([row]).select().single();
    if (error) {
      console.error('Supabase createProduct error:', error);
      throw error;
    }

    const price = Number(data.price);
    const oldPrice = data.old_price ? Number(data.old_price) : undefined;

    return {
      id: data.id,
      reference: data.reference,
      name: { fr: data.name_fr, ar: data.name_ar },
      slug: data.slug,
      description: { fr: data.description_fr || '', ar: data.description_ar || '' },
      price,
      oldPrice,
      stock: Number(data.stock ?? 10),
      brandId: data.brand_id || 'brand-generic',
      brand: data.brand_id || 'Électroménager',
      categoryId: data.category_id || 'gros-electromenager',
      category: data.category_id || 'gros-electromenager',
      mainImage: data.main_image,
      images: data.images || [data.main_image],
      technicalSpecifications: [],
      specifications: [],
      warranty: '12 Mois',
      color: { fr: 'Inox', ar: 'إينوكس' },
      featured: Boolean(data.is_featured),
      isActive: Boolean(data.is_active),
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    };
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase Client non configuré.');

    const patch: any = {};
    if (updates.reference) patch.reference = updates.reference;
    if (updates.name) {
      if (updates.name.fr) patch.name_fr = updates.name.fr;
      if (updates.name.ar) patch.name_ar = updates.name.ar;
    }
    if (updates.slug) patch.slug = updates.slug;
    if (updates.description) {
      if (updates.description.fr) patch.description_fr = updates.description.fr;
      if (updates.description.ar) patch.description_ar = updates.description.ar;
    }
    if (updates.price !== undefined) patch.price = updates.price;
    if (updates.oldPrice !== undefined) patch.old_price = updates.oldPrice;
    if (updates.categoryId !== undefined) patch.category_id = updates.categoryId;
    if (updates.brandId !== undefined) patch.brand_id = updates.brandId;
    if (updates.mainImage) patch.main_image = updates.mainImage;
    if (updates.images) patch.images = updates.images;
    if (updates.featured !== undefined) patch.is_featured = updates.featured;
    if (updates.isActive !== undefined) patch.is_active = updates.isActive;

    patch.updated_at = new Date().toISOString();

    const { data, error } = await client.from('products').update(patch).eq('id', id).select().single();
    if (error) {
      console.error('Supabase updateProduct error:', error);
      return null;
    }

    const price = Number(data.price);
    const oldPrice = data.old_price ? Number(data.old_price) : undefined;

    return {
      id: data.id,
      reference: data.reference,
      name: { fr: data.name_fr, ar: data.name_ar },
      slug: data.slug,
      description: { fr: data.description_fr || '', ar: data.description_ar || '' },
      price,
      oldPrice,
      stock: Number(data.stock ?? 10),
      brandId: data.brand_id || 'brand-generic',
      brand: data.brand_id || 'Électroménager',
      categoryId: data.category_id || 'gros-electromenager',
      category: data.category_id || 'gros-electromenager',
      mainImage: data.main_image,
      images: data.images || [data.main_image],
      technicalSpecifications: [],
      specifications: [],
      warranty: '12 Mois',
      color: { fr: 'Inox', ar: 'إينوكس' },
      featured: Boolean(data.is_featured),
      isActive: Boolean(data.is_active),
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    };
  },

  async deleteProduct(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    // Supprimer les relations dans pack_products pour respecter la contrainte
    await client.from('pack_products').delete().eq('product_id', id);

    const { error } = await client.from('products').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteProduct error:', error);
      return false;
    }
    return true;
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    let { data, error } = await client.from('categories').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase getCategories ordered query warning:', error);
      const res = await client.from('categories').select('*');
      data = res.data;
      if (res.error) {
        console.error('Supabase getCategories error:', res.error);
        return [];
      }
    }

    return (data || []).map((c) => ({
      id: c.id,
      name: { fr: c.name_fr || '', ar: c.name_ar || '' },
      slug: c.slug || '',
      description: { fr: c.description_fr || '', ar: c.description_ar || '' },
      image: c.image || '',
      isActive: Boolean(c.is_active),
    }));
  },

  async createCategory(cat: Partial<Category>): Promise<Category> {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase Client non configuré.');

    const newId = cat.id || `cat-${Date.now()}`;
    const row = {
      id: newId,
      name_fr: cat.name?.fr || 'Nouvelle Catégorie',
      name_ar: cat.name?.ar || 'صنف جديد',
      slug: cat.slug || (cat.name?.fr || 'categorie').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description_fr: cat.description?.fr || '',
      description_ar: cat.description?.ar || '',
      image: cat.image || '',
      is_active: cat.isActive ?? true,
    };

    const { data, error } = await client.from('categories').insert([row]).select().single();
    if (error) {
      console.error('Supabase createCategory error:', error);
      throw error;
    }

    return {
      id: data.id,
      name: { fr: data.name_fr, ar: data.name_ar },
      slug: data.slug,
      description: { fr: data.description_fr || '', ar: data.description_ar || '' },
      image: data.image || '',
      isActive: Boolean(data.is_active),
    };
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const patch: any = {};
    if (updates.name) {
      if (updates.name.fr) patch.name_fr = updates.name.fr;
      if (updates.name.ar) patch.name_ar = updates.name.ar;
    }
    if (updates.slug) patch.slug = updates.slug;
    if (updates.description) {
      if (updates.description.fr) patch.description_fr = updates.description.fr;
      if (updates.description.ar) patch.description_ar = updates.description.ar;
    }
    if (updates.image !== undefined) patch.image = updates.image;
    if (updates.isActive !== undefined) patch.is_active = updates.isActive;

    patch.updated_at = new Date().toISOString();

    const { data, error } = await client.from('categories').update(patch).eq('id', id).select().single();
    if (error) {
      console.error('Supabase updateCategory error:', error);
      return null;
    }

    return {
      id: data.id,
      name: { fr: data.name_fr, ar: data.name_ar },
      slug: data.slug,
      description: { fr: data.description_fr || '', ar: data.description_ar || '' },
      image: data.image || '',
      isActive: Boolean(data.is_active),
    };
  },

  async deleteCategory(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    const { error } = await client.from('categories').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteCategory error:', error);
      return false;
    }
    return true;
  },

  // BRANDS
  async getBrands(): Promise<Brand[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    let { data, error } = await client.from('brands').select('*').order('created_at', { ascending: true });
    if (error) {
      console.warn('Supabase getBrands ordered query warning:', error);
      const res = await client.from('brands').select('*');
      data = res.data;
      if (res.error) {
        console.error('Supabase getBrands error:', res.error);
        return [];
      }
    }

    return (data || []).map((b) => {
      let desc = { fr: '', ar: '' };
      if (b.description) {
        if (typeof b.description === 'object') {
          desc = { fr: b.description.fr || '', ar: b.description.ar || '' };
        } else if (typeof b.description === 'string') {
          try {
            const parsed = JSON.parse(b.description);
            desc = { fr: parsed.fr || '', ar: parsed.ar || '' };
          } catch {
            desc = { fr: b.description, ar: b.description };
          }
        }
      }
      return {
        id: b.id,
        name: b.name,
        slug: b.slug,
        logo: b.logo || '',
        description: desc,
        isActive: Boolean(b.is_active),
      };
    });
  },

  async createBrand(brand: Partial<Brand>): Promise<Brand> {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase Client non configuré.');

    const newId = brand.id || `brand-${Date.now()}`;
    const row = {
      id: newId,
      name: brand.name || 'Marque',
      slug: brand.slug || (brand.name || 'marque').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      logo: brand.logo || '',
      description: typeof brand.description === 'string' ? brand.description : brand.description?.fr || '',
      is_active: brand.isActive ?? true,
    };

    const { data, error } = await client.from('brands').insert([row]).select().single();
    if (error) {
      console.error('Supabase createBrand error:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      logo: data.logo || '',
      description: { fr: data.description || '', ar: data.description || '' },
      isActive: Boolean(data.is_active),
    };
  },

  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const patch: any = {};
    if (updates.name) patch.name = updates.name;
    if (updates.slug) patch.slug = updates.slug;
    if (updates.logo !== undefined) patch.logo = updates.logo;
    if (updates.description !== undefined) {
      patch.description = typeof updates.description === 'string' ? updates.description : updates.description.fr;
    }
    if (updates.isActive !== undefined) patch.is_active = updates.isActive;

    patch.updated_at = new Date().toISOString();

    const { data, error } = await client.from('brands').update(patch).eq('id', id).select().single();
    if (error) {
      console.error('Supabase updateBrand error:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      logo: data.logo || '',
      description: { fr: data.description || '', ar: data.description || '' },
      isActive: Boolean(data.is_active),
    };
  },

  async deleteBrand(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    const { error } = await client.from('brands').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteBrand error:', error);
      return false;
    }
    return true;
  },

  // PROMOTIONS
  async getPromotions(): Promise<Promotion[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client.from('promotions').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase getPromotions error:', error);
      return [];
    }

    return (data || []).map((p) => ({
      id: p.id,
      productId: 'prod-1',
      title: { fr: p.title_fr, ar: p.title_ar },
      oldPrice: 1000,
      newPrice: 800,
      discountPercentage: p.discount_percentage,
      startDate: p.start_date,
      endDate: p.end_date,
      isActive: Boolean(p.is_active),
    }));
  },

  async createPromotion(promo: Partial<Promotion>): Promise<Promotion> {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase Client non configuré.');

    const newId = promo.id || `promo-${Date.now()}`;
    const row = {
      id: newId,
      title_fr: promo.title?.fr || 'Offre Spéciale',
      title_ar: promo.title?.ar || 'عرض خاص',
      description_fr: '',
      description_ar: '',
      discount_percentage: promo.discountPercentage || 10,
      banner_image: '',
      start_date: promo.startDate || new Date().toISOString(),
      end_date: promo.endDate || new Date(Date.now() + 86400000 * 30).toISOString(),
      is_active: promo.isActive ?? true,
    };

    const { data, error } = await client.from('promotions').insert([row]).select().single();
    if (error) {
      console.error('Supabase createPromotion error:', error);
      throw error;
    }

    return {
      id: data.id,
      productId: 'prod-1',
      title: { fr: data.title_fr, ar: data.title_ar },
      oldPrice: promo.oldPrice || 1000,
      newPrice: promo.newPrice || 900,
      discountPercentage: data.discount_percentage,
      startDate: data.start_date,
      endDate: data.end_date,
      isActive: Boolean(data.is_active),
    };
  },

  async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const patch: any = {};
    if (updates.title) {
      if (updates.title.fr) patch.title_fr = updates.title.fr;
      if (updates.title.ar) patch.title_ar = updates.title.ar;
    }
    if (updates.discountPercentage !== undefined) patch.discount_percentage = updates.discountPercentage;
    if (updates.startDate) patch.start_date = updates.startDate;
    if (updates.endDate) patch.end_date = updates.endDate;
    if (updates.isActive !== undefined) patch.is_active = updates.isActive;

    patch.updated_at = new Date().toISOString();

    const { data, error } = await client.from('promotions').update(patch).eq('id', id).select().single();
    if (error) {
      console.error('Supabase updatePromotion error:', error);
      return null;
    }

    return {
      id: data.id,
      productId: 'prod-1',
      title: { fr: data.title_fr, ar: data.title_ar },
      oldPrice: 1000,
      newPrice: 800,
      discountPercentage: data.discount_percentage,
      startDate: data.start_date,
      endDate: data.end_date,
      isActive: Boolean(data.is_active),
    };
  },

  async deletePromotion(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    const { error } = await client.from('promotions').delete().eq('id', id);
    if (error) {
      console.error('Supabase deletePromotion error:', error);
      return false;
    }
    return true;
  },

  // PACKS
  async getPacks(): Promise<Pack[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data: packsData, error: packsErr } = await client
      .from('packs')
      .select('*')
      .order('created_at', { ascending: false });

    if (packsErr) {
      console.error('Supabase getPacks error:', packsErr);
      return [];
    }

    const { data: packProdsData, error: ppErr } = await client
      .from('pack_products')
      .select('*');

    if (ppErr) {
      console.error('Supabase pack_products error:', ppErr);
    }

    const allProducts = await this.getProducts();

    const packProductsMap = new Map<string, Array<{ productId: string; quantity: number }>>();
    (packProdsData || []).forEach((row: any) => {
      const packId = row.pack_id;
      const productId = row.product_id;
      const quantity = row.quantity || 1;
      if (!packId || !productId) return;

      if (!packProductsMap.has(packId)) {
        packProductsMap.set(packId, []);
      }
      const existingList = packProductsMap.get(packId)!;
      if (!existingList.some((item) => item.productId === productId)) {
        existingList.push({ productId, quantity });
      }
    });

    return (packsData || []).map((p) => {
      const price = Number(p.price);
      const oldPrice = p.old_price ? Number(p.old_price) : price * 1.2;
      const packItems = packProductsMap.get(p.id) || [];
      const productIds = packItems.map((item) => item.productId);
      const packProds = allProducts.filter((prod) => productIds.includes(prod.id));

      return {
        id: p.id,
        name: { fr: p.name_fr, ar: p.name_ar },
        slug: p.slug,
        description: { fr: p.description_fr || '', ar: p.description_ar || '' },
        image: p.image,
        normalPrice: oldPrice,
        packPrice: price,
        price,
        oldPrice,
        savings: Math.max(0, oldPrice - price),
        isActive: Boolean(p.is_active),
        createdAt: p.created_at,
        updatedAt: p.updated_at || p.created_at,
        packProducts: packItems,
        products: packProds,
      };
    });
  },

  async createPack(pack: Partial<Pack>): Promise<Pack> {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase Client non configuré.');

    const newId = pack.id || `pack-${Date.now()}`;
    const price = pack.packPrice || pack.price || 5000;
    const oldPrice = pack.normalPrice || pack.oldPrice || price * 1.2;

    let rawItems: Array<{ productId: string; quantity: number }> = [];
    if (pack.packProducts && Array.isArray(pack.packProducts)) {
      rawItems = pack.packProducts.map((p) => ({ productId: p.productId, quantity: p.quantity || 1 }));
    } else if (pack.products && Array.isArray(pack.products)) {
      rawItems = pack.products.map((p) => ({ productId: p.id, quantity: 1 }));
    }

    const itemMap = new Map<string, number>();
    rawItems.forEach((item) => {
      if (item.productId) {
        itemMap.set(item.productId, item.quantity || 1);
      }
    });

    const row = {
      id: newId,
      name_fr: pack.name?.fr || 'Nouveau Pack',
      name_ar: pack.name?.ar || 'باك جديد',
      slug: pack.slug || (pack.name?.fr || 'pack').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description_fr: pack.description?.fr || '',
      description_ar: pack.description?.ar || '',
      price,
      old_price: oldPrice,
      image: pack.image || '',
      is_active: pack.isActive ?? true,
    };

    const { data, error } = await client.from('packs').insert([row]).select().single();
    if (error) {
      console.error('Supabase createPack error:', error);
      throw error;
    }

    const packProdRows = Array.from(itemMap.keys()).map((pid) => ({
      pack_id: newId,
      product_id: pid,
    }));

    if (packProdRows.length > 0) {
      const { error: ppErr } = await client.from('pack_products').insert(packProdRows);
      if (ppErr) {
        console.error('Supabase pack_products insert error:', ppErr);
      }
    }

    const prodIds = Array.from(itemMap.keys());
    const allProducts = await this.getProducts();
    const packProds = allProducts.filter((prod) => prodIds.includes(prod.id));

    return {
      id: data.id,
      name: { fr: data.name_fr, ar: data.name_ar },
      slug: data.slug,
      description: { fr: data.description_fr || '', ar: data.description_ar || '' },
      image: data.image,
      normalPrice: oldPrice,
      packPrice: price,
      price,
      oldPrice,
      savings: Math.max(0, oldPrice - price),
      isActive: Boolean(data.is_active),
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
      packProducts: Array.from(itemMap.entries()).map(([pid, qty]) => ({ productId: pid, quantity: qty })),
      products: packProds,
    };
  },

  async updatePack(id: string, updates: Partial<Pack>): Promise<Pack | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const patch: any = {};
    if (updates.name) {
      if (updates.name.fr) patch.name_fr = updates.name.fr;
      if (updates.name.ar) patch.name_ar = updates.name.ar;
    }
    if (updates.slug) patch.slug = updates.slug;
    if (updates.description) {
      if (updates.description.fr) patch.description_fr = updates.description.fr;
      if (updates.description.ar) patch.description_ar = updates.description.ar;
    }
    if (updates.packPrice !== undefined || updates.price !== undefined) {
      patch.price = updates.packPrice ?? updates.price;
    }
    if (updates.normalPrice !== undefined || updates.oldPrice !== undefined) {
      patch.old_price = updates.normalPrice ?? updates.oldPrice;
    }
    if (updates.image !== undefined) patch.image = updates.image;
    if (updates.isActive !== undefined) patch.is_active = updates.isActive;

    patch.updated_at = new Date().toISOString();

    const { error } = await client.from('packs').update(patch).eq('id', id);
    if (error) {
      console.error('Supabase updatePack error:', error);
      return null;
    }

    let rawItems: Array<{ productId: string; quantity: number }> | null = null;
    if (updates.packProducts && Array.isArray(updates.packProducts)) {
      rawItems = updates.packProducts.map((p) => ({ productId: p.productId, quantity: p.quantity || 1 }));
    } else if (updates.products && Array.isArray(updates.products)) {
      rawItems = updates.products.map((p) => ({ productId: p.id, quantity: 1 }));
    }

    if (rawItems !== null) {
      const itemMap = new Map<string, number>();
      rawItems.forEach((item) => {
        if (item.productId) {
          itemMap.set(item.productId, item.quantity || 1);
        }
      });

      await client.from('pack_products').delete().eq('pack_id', id);

      const packProdRows = Array.from(itemMap.keys()).map((pid) => ({
        pack_id: id,
        product_id: pid,
      }));

      if (packProdRows.length > 0) {
        await client.from('pack_products').insert(packProdRows);
      }
    }

    const allPacks = await this.getPacks();
    return allPacks.find((p) => p.id === id) || null;
  },

  async deletePack(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    // Supprimer les relations de la table d'association
    await client.from('pack_products').delete().eq('pack_id', id);

    const { error } = await client.from('packs').delete().eq('id', id);
    if (error) {
      console.error('Supabase deletePack error:', error);
      return false;
    }
    return true;
  },

  // ORDERS & CUSTOMERS
  async getOrders(): Promise<Order[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data: orderRows, error: orderErr } = await client
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (orderErr) {
      console.error('Supabase getOrders error:', orderErr);
      return [];
    }

    return (orderRows || []).map((o) => {
      const items: OrderItem[] = (o.order_items || []).map((item: any) => ({
        id: item.id,
        orderId: o.id,
        productId: item.product_id,
        productName: item.product_name,
        productReference: item.product_reference,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        totalPrice: Number(item.total_price),
      }));

      const total = Number(o.total);

      return {
        id: o.id,
        orderNumber: o.order_number,
        customerId: o.customer_id,
        customerName: o.customer_name,
        customerPhone: o.customer_phone,
        customerEmail: o.customer_email || '',
        city: o.city || 'Taourirt',
        address: o.address,
        notes: o.notes || '',
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        deliveryFee: Number(o.delivery_fee),
        total,
        totalAmount: total,
        date: o.created_at,
        paymentMethod: o.payment_method || 'Paiement à la livraison',
        status: o.status as OrderStatus,
        createdAt: o.created_at,
        updatedAt: o.updated_at,
        customer: {
          fullName: o.customer_name,
          phone: o.customer_phone,
          email: o.customer_email || '',
          city: o.city || 'Taourirt',
          address: o.address,
          notes: o.notes || '',
        },
        items,
      };
    });
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, order_items(*)')
      .single();

    if (error) {
      console.error('Supabase updateOrderStatus error:', error);
      return null;
    }

    const total = Number(data.total);

    return {
      id: data.id,
      orderNumber: data.order_number,
      customerId: data.customer_id,
      customerName: data.customer_name,
      customerPhone: data.customer_phone,
      customerEmail: data.customer_email || '',
      city: data.city || 'Taourirt',
      address: data.address,
      notes: data.notes || '',
      subtotal: Number(data.subtotal),
      discount: Number(data.discount),
      deliveryFee: Number(data.delivery_fee),
      total,
      totalAmount: total,
      date: data.created_at,
      paymentMethod: data.payment_method || 'Paiement à la livraison',
      status: data.status as OrderStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      customer: {
        fullName: data.customer_name,
        phone: data.customer_phone,
        email: data.customer_email || '',
        city: data.city || 'Taourirt',
        address: data.address,
        notes: data.notes || '',
      },
      items: (data.order_items || []).map((item: any) => ({
        id: item.id,
        orderId: data.id,
        productId: item.product_id,
        productName: item.product_name,
        productReference: item.product_reference,
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        totalPrice: Number(item.total_price),
      })),
    };
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
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase client non configuré.');

    const productIds = params.items.map((i) => i.productId);

    const [{ data: dbProducts }, { data: dbPacks }] = await Promise.all([
      client.from('products').select('*').in('id', productIds),
      client.from('packs').select('*').in('id', productIds),
    ]);

    const dbProductMap = new Map<string, any>();
    if (dbProducts) {
      dbProducts.forEach((p) => dbProductMap.set(p.id, p));
    }

    const dbPackMap = new Map<string, any>();
    if (dbPacks) {
      dbPacks.forEach((p) => dbPackMap.set(p.id, p));
    }

    const orderItemsToInsert: any[] = [];
    let subtotal = 0;

    for (const reqItem of params.items) {
      const prod = dbProductMap.get(reqItem.productId);
      const pack = dbPackMap.get(reqItem.productId);

      let unitPrice = reqItem.price || 0;
      let prodName = reqItem.productName || 'Produit';
      let prodRef = reqItem.productReference || 'REF-GEN';
      let validProductIdForFk: string | null = null;

      if (prod) {
        unitPrice = Number(prod.price) || unitPrice;
        prodName = prod.name_fr || prodName;
        prodRef = prod.reference || prodRef;
        validProductIdForFk = prod.id;
      } else if (pack) {
        unitPrice = Number(pack.price) || unitPrice;
        prodName = pack.name_fr || prodName;
        prodRef = pack.slug || pack.id || prodRef;
        validProductIdForFk = null; // foreign key in order_items points to products(id)
      } else {
        validProductIdForFk = null;
      }

      const qty = Math.max(1, Math.floor(reqItem.quantity || 1));
      const itemTotal = unitPrice * qty;

      subtotal += itemTotal;

      orderItemsToInsert.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product_id: validProductIdForFk,
        product_name: prodName,
        product_reference: prodRef,
        quantity: qty,
        unit_price: unitPrice,
        total_price: itemTotal,
      });
    }

    const discount = 0;
    const deliveryFee = 0;
    const total = subtotal - discount + deliveryFee;

    const { data: existingCust } = await client
      .from('customers')
      .select('*')
      .eq('phone', params.phone.trim())
      .limit(1)
      .maybeSingle();

    let customerId = existingCust?.id;

    if (!customerId) {
      customerId = `cust-${Date.now()}`;
      const newCustRow = {
        id: customerId,
        full_name: params.fullName.trim(),
        phone: params.phone.trim(),
        email: params.email?.trim() || null,
        city: 'Taourirt',
        address: params.address.trim(),
        notes: params.notes?.trim() || null,
      };
      const { error: custErr } = await client.from('customers').insert([newCustRow]);
      if (custErr) {
        console.error('Supabase customer insertion error:', custErr);
      }
    } else {
      await client
        .from('customers')
        .update({
          full_name: params.fullName.trim(),
          address: params.address.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', customerId);
    }

    const { count } = await client.from('orders').select('*', { count: 'exact', head: true });
    const orderSeq = (count || 0) + 1;
    const orderNumber = `EF-2026-${String(orderSeq).padStart(6, '0')}`;
    const orderId = `ord-${Date.now()}`;

    const orderRow = {
      id: orderId,
      order_number: orderNumber,
      customer_id: customerId,
      customer_name: params.fullName.trim(),
      customer_phone: params.phone.trim(),
      customer_email: params.email?.trim() || null,
      city: 'Taourirt',
      address: params.address.trim(),
      notes: params.notes?.trim() || null,
      subtotal,
      discount,
      delivery_fee: deliveryFee,
      total,
      payment_method: 'Paiement à la livraison',
      status: 'Nouvelle',
    };

    const { data: createdOrder, error: orderInsErr } = await client
      .from('orders')
      .insert([orderRow])
      .select()
      .single();

    if (orderInsErr) {
      console.error('Supabase order creation error:', orderInsErr);
      throw new Error(orderInsErr.message || 'Erreur lors de la création de la commande');
    }

    orderItemsToInsert.forEach((item) => {
      item.order_id = createdOrder.id;
    });

    const { error: itemsInsErr } = await client.from('order_items').insert(orderItemsToInsert);
    if (itemsInsErr) {
      console.error('Supabase order items creation error:', itemsInsErr);
    }

    const items: OrderItem[] = orderItemsToInsert.map((item) => ({
      id: item.id,
      orderId: createdOrder.id,
      productId: item.product_id,
      productName: item.product_name,
      productReference: item.product_reference,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalPrice: item.total_price,
    }));

    return {
      id: createdOrder.id,
      orderNumber: createdOrder.order_number,
      customerId: createdOrder.customer_id,
      customerName: createdOrder.customer_name,
      customerPhone: createdOrder.customer_phone,
      customerEmail: createdOrder.customer_email || '',
      city: 'Taourirt',
      address: createdOrder.address,
      notes: createdOrder.notes || '',
      subtotal,
      discount,
      deliveryFee,
      total,
      totalAmount: total,
      date: createdOrder.created_at,
      paymentMethod: 'Paiement à la livraison',
      status: 'Nouvelle',
      createdAt: createdOrder.created_at,
      updatedAt: createdOrder.updated_at,
      customer: {
        fullName: createdOrder.customer_name,
        phone: createdOrder.customer_phone,
        email: createdOrder.customer_email || '',
        city: 'Taourirt',
        address: createdOrder.address,
        notes: createdOrder.notes || '',
      },
      items,
    };
  },

  async getCustomers(): Promise<CustomerRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data: customers, error } = await client.from('customers').select('*');
    if (error) return [];

    const orders = await this.getOrders();

    return customers.map((c) => {
      const custOrders = orders.filter((o) => o.customerId === c.id);
      const totalSpent = custOrders.reduce((sum, o) => sum + o.total, 0);
      const lastOrder = custOrders[0]?.createdAt || c.updated_at;

      return {
        id: c.id,
        fullName: c.full_name,
        phone: c.phone,
        email: c.email || '',
        city: c.city || 'Taourirt',
        address: c.address,
        notes: c.notes || '',
        totalOrders: custOrders.length,
        totalSpent,
        lastOrderDate: lastOrder,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      };
    });
  },

  async getCustomerById(id: string): Promise<CustomerRecord | null> {
    const customers = await this.getCustomers();
    return customers.find((c) => c.id === id) || null;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const orders = await this.getOrders();
    const products = await this.getProducts();
    const categories = await this.getCategories();
    const brands = await this.getBrands();
    const promotions = await this.getPromotions();
    const packs = await this.getPacks();

    const statusCounts: Record<OrderStatus, number> = {
      Nouvelle: 0,
      Confirmée: 0,
      'En préparation': 0,
      'En livraison': 0,
      Livrée: 0,
      Annulée: 0,
      en_attente: 0,
    };

    let totalRevenue = 0;
    orders.forEach((o) => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
      totalRevenue += o.total;
    });

    return {
      orders: {
        today: orders.length,
        thisWeek: orders.length,
        thisMonth: orders.length,
      },
      revenue: {
        today: totalRevenue,
        thisWeek: totalRevenue,
        thisMonth: totalRevenue,
      },
      statusCounts,
      catalogCounts: {
        products: products.length,
        categories: categories.length,
        brands: brands.length,
        promotions: promotions.length,
        packs: packs.length,
      },
    };
  },
};
