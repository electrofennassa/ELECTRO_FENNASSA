import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

async function migrateDataToSupabase() {
  console.log('=== ELECTRO_FENNASSA: DÉBUT DE MIGRATION JSON VERS SUPABASE ===');

  const supabaseUrl = process.env.SUPABASE_URL || 'https://hnfehxkdaxcfshnzjmae.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ ERREUR: SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies dans les variables d environnement.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const dbJsonPath = path.join(process.cwd(), 'data', 'db.json');
  if (!fs.existsSync(dbJsonPath)) {
    console.error(`❌ ERREUR: Fichier de données local introuvable à : ${dbJsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dbJsonPath, 'utf-8');
  const dbData = JSON.parse(rawData);

  console.log('📂 Chargement du fichier db.json local réussi.');

  // 1. Categories
  if (dbData.categories && dbData.categories.length > 0) {
    console.log(`⏳ Migration de ${dbData.categories.length} catégories...`);
    const categoryRows = dbData.categories.map((c: any) => ({
      id: c.id,
      name_fr: c.name.fr,
      name_ar: c.name.ar,
      slug: c.slug,
      description_fr: c.description?.fr || '',
      description_ar: c.description?.ar || '',
      image: c.image || '',
      icon: c.icon || 'Grid',
      is_active: c.isActive ?? true,
    }));
    const { error } = await supabase.from('categories').upsert(categoryRows);
    if (error) console.error('Erreur migration catégories:', error);
    else console.log('✅ Catégories migrées.');
  }

  // 2. Brands
  if (dbData.brands && dbData.brands.length > 0) {
    console.log(`⏳ Migration de ${dbData.brands.length} marques...`);
    const brandRows = dbData.brands.map((b: any) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logo: b.logo || '',
      description: b.description || '',
      is_active: b.isActive ?? true,
    }));
    const { error } = await supabase.from('brands').upsert(brandRows);
    if (error) console.error('Erreur migration marques:', error);
    else console.log('✅ Marques migrées.');
  }

  // 3. Products
  if (dbData.products && dbData.products.length > 0) {
    console.log(`⏳ Migration de ${dbData.products.length} produits...`);
    const productRows = dbData.products.map((p: any) => ({
      id: p.id,
      reference: p.reference,
      name_fr: p.name.fr,
      name_ar: p.name.ar,
      slug: p.slug,
      description_fr: p.description.fr,
      description_ar: p.description.ar,
      price: p.price,
      old_price: p.oldPrice || null,
      category_id: p.categoryId || null,
      brand_id: p.brandId || null,
      main_image: p.mainImage,
      images: p.images || [],
      features: p.features?.fr || [],
      specifications: p.specifications || {},
      warranty_months: p.warrantyMonths || 12,
      is_featured: p.isFeatured ?? false,
      is_active: p.isActive ?? true,
    }));
    const { error } = await supabase.from('products').upsert(productRows);
    if (error) console.error('Erreur migration produits:', error);
    else console.log('✅ Produits migrés.');
  }

  // 4. Promotions
  if (dbData.promotions && dbData.promotions.length > 0) {
    console.log(`⏳ Migration de ${dbData.promotions.length} promotions...`);
    const promoRows = dbData.promotions.map((p: any) => ({
      id: p.id,
      title_fr: p.title.fr,
      title_ar: p.title.ar,
      description_fr: p.description?.fr || '',
      description_ar: p.description?.ar || '',
      discount_percentage: p.discountPercentage,
      banner_image: p.bannerImage,
      start_date: p.startDate,
      end_date: p.endDate,
      is_active: p.isActive ?? true,
    }));
    const { error } = await supabase.from('promotions').upsert(promoRows);
    if (error) console.error('Erreur migration promotions:', error);
    else console.log('✅ Promotions migrées.');
  }

  // 5. Packs & Pack Products
  if (dbData.packs && dbData.packs.length > 0) {
    console.log(`⏳ Migration de ${dbData.packs.length} packs...`);
    const packRows = dbData.packs.map((p: any) => ({
      id: p.id,
      name_fr: p.name.fr,
      name_ar: p.name.ar,
      slug: p.slug,
      description_fr: p.description?.fr || '',
      description_ar: p.description?.ar || '',
      price: p.price || p.packPrice,
      old_price: p.oldPrice || p.normalPrice || null,
      image: p.image,
      is_active: p.isActive ?? true,
    }));
    const { error } = await supabase.from('packs').upsert(packRows);
    if (error) console.error('Erreur migration packs:', error);
    else console.log('✅ Packs migrés.');

    console.log('⏳ Migration des relations pack_products...');
    const allPackProductRows: Array<{ pack_id: string; product_id: string }> = [];

    for (const p of dbData.packs) {
      const itemMap = new Map<string, number>();

      if (Array.isArray(p.packProducts)) {
        p.packProducts.forEach((item: any) => {
          if (item?.productId) {
            itemMap.set(item.productId, item.quantity || 1);
          }
        });
      } else if (Array.isArray(p.productIds)) {
        p.productIds.forEach((pid: string) => {
          if (pid) {
            itemMap.set(pid, 1);
          }
        });
      } else if (Array.isArray(p.products)) {
        p.products.forEach((item: any) => {
          if (item?.id) {
            itemMap.set(item.id, 1);
          }
        });
      }

      for (const prodId of itemMap.keys()) {
        allPackProductRows.push({
          pack_id: p.id,
          product_id: prodId,
        });
      }
    }

    if (allPackProductRows.length > 0) {
      const packIds = dbData.packs.map((p: any) => p.id);
      await supabase.from('pack_products').delete().in('pack_id', packIds);

      const { error: ppError } = await supabase.from('pack_products').insert(allPackProductRows);
      if (ppError) console.error('Erreur migration pack_products:', ppError);
      else console.log(`✅ ${allPackProductRows.length} relations pack_products migrées.`);
    }
  }

  // 6. Customers
  if (dbData.customers && dbData.customers.length > 0) {
    console.log(`⏳ Migration de ${dbData.customers.length} clients...`);
    const customerRows = dbData.customers.map((c: any) => ({
      id: c.id,
      full_name: c.fullName,
      phone: c.phone,
      email: c.email || null,
      city: c.city || 'Taourirt',
      address: c.address,
      notes: c.notes || null,
    }));
    const { error } = await supabase.from('customers').upsert(customerRows);
    if (error) console.error('Erreur migration clients:', error);
    else console.log('✅ Clients migrés.');
  }

  // 7. Orders & Order Items
  if (dbData.orders && dbData.orders.length > 0) {
    console.log(`⏳ Migration de ${dbData.orders.length} commandes...`);
    const validProductIds = new Set((dbData.products || []).map((p: any) => p.id));

    for (const o of dbData.orders) {
      const orderRow = {
        id: o.id,
        order_number: o.orderNumber,
        customer_id: o.customerId,
        customer_name: o.customerName || o.customer?.fullName,
        customer_phone: o.customerPhone || o.customer?.phone,
        customer_email: o.customerEmail || o.customer?.email || null,
        city: 'Taourirt',
        address: o.address || o.customer?.address,
        notes: o.notes || null,
        subtotal: o.subtotal || o.total,
        discount: o.discount || 0,
        delivery_fee: o.deliveryFee || 0,
        total: o.total || o.totalAmount,
        payment_method: o.paymentMethod || 'Paiement à la livraison',
        status: o.status || 'Nouvelle',
        created_at: o.createdAt || new Date().toISOString(),
      };

      const { error: ordErr } = await supabase.from('orders').upsert([orderRow]);
      if (ordErr) {
        console.error(`Erreur migration commande ${o.id}:`, ordErr);
        continue;
      }

      if (o.items && o.items.length > 0) {
        const itemRows = o.items.map((i: any, idx: number) => ({
          id: `item-${o.id}-${idx}`,
          order_id: o.id,
          product_id: validProductIds.has(i.productId) ? i.productId : null,
          product_name: i.productName,
          product_reference: i.productReference || 'REF-GEN',
          quantity: i.quantity,
          unit_price: i.unitPrice,
          total_price: i.totalPrice || i.unitPrice * i.quantity,
        }));
        await supabase.from('order_items').upsert(itemRows);
      }
    }
    console.log('✅ Commandes et lignes de commande migrées.');
  }

  console.log('🎉 MIGRATION VERS SUPABASE TERMINÉE AVEC SUCCÈS !');
}

migrateDataToSupabase().catch((e) => {
  console.error('Fatal Migration Error:', e);
  process.exit(1);
});
