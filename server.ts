import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { dataManager } from './server/dataManager';
import { OrderStatus } from './src/types';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Auth & Security Configuration
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@electrofennassa.ma';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123456';
const JWT_SECRET = process.env.JWT_SECRET || 'ef_secure_jwt_secret_key_2026';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    console.warn('⚠️ [SÉCURITÉ VERCEL/PRODUCTION] ADMIN_EMAIL, ADMIN_PASSWORD ou JWT_SECRET ne sont pas définis explicitement.');
  }
}

// Middleware to check admin JWT token statelessly
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Token d authentification manquant.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
    }
    (req as any).adminUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expirée ou token invalide. Veuillez vous re-connecter.' });
  }
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'ELECTRO_FENNASSA',
    city: 'Taourirt',
    storage: process.env.SUPABASE_URL ? 'Supabase PostgreSQL' : 'Local JSON Fallback',
  });
});

// 2. Admin Authentication (Stateless JWT)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Veuillez saisir un e-mail et un mot de passe.' });
  }

  if (email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim() && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Also set HttpOnly cookie for browser security if supported
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: 'usr-admin-1',
        email: ADMIN_EMAIL,
        role: 'admin',
      },
    });
  } else {
    return res.status(401).json({ error: 'E-mail ou mot de passe incorrect.' });
  }
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
    return res.json({
      authenticated: true,
      user: {
        id: 'usr-admin-1',
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false });
  }
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Déconnexion réussie.' });
});

// 3. Products Endpoints
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await dataManager.getProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits.' });
  }
});

app.post('/api/products', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const newProduct = await dataManager.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la création du produit.' });
  }
});

app.put('/api/products/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Produit non trouvé.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deleteProduct(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Produit non trouvé.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Categories Endpoints
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const categories = await dataManager.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories.' });
  }
});

app.post('/api/categories', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const cat = await dataManager.createCategory(req.body);
    res.status(201).json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Catégorie non trouvée.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deleteCategory(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Catégorie non trouvée.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Brands Endpoints
app.get('/api/brands', async (req: Request, res: Response) => {
  try {
    const brands = await dataManager.getBrands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des marques.' });
  }
});

app.post('/api/brands', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const brand = await dataManager.createBrand(req.body);
    res.status(201).json(brand);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/brands/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updateBrand(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Marque non trouvée.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/brands/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deleteBrand(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Marque non trouvée.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Promotions Endpoints
app.get('/api/promotions', async (req: Request, res: Response) => {
  try {
    const promotions = await dataManager.getPromotions();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des promotions.' });
  }
});

app.post('/api/promotions', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const promo = await dataManager.createPromotion(req.body);
    res.status(201).json(promo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/promotions/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updatePromotion(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Promotion non trouvée.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/promotions/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deletePromotion(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Promotion non trouvée.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Packs Endpoints
app.get('/api/packs', async (req: Request, res: Response) => {
  try {
    const packs = await dataManager.getPacks();
    res.json(packs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des packs.' });
  }
});

app.post('/api/packs', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const pack = await dataManager.createPack(req.body);
    res.status(201).json(pack);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/packs/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updatePack(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Pack non trouvé.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/packs/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deletePack(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Pack non trouvé.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Public Order Placement Endpoint (With Strict Server-Side Validation & Price Recalculation)
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, city, address, notes, items } = req.body;

    // Strict Input Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Veuillez renseigner un nom complet valide.' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return res.status(400).json({ error: 'Veuillez renseigner un numéro de téléphone valide.' });
    }

    if (!address || typeof address !== 'string' || address.trim().length < 5) {
      return res.status(400).json({ error: 'Veuillez renseigner une adresse de livraison complète.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Votre panier est vide.' });
    }

    // Format items array for server validation
    const formattedItems = items.map((i: any) => ({
      productId: i.productId || i.id,
      quantity: Math.max(1, parseInt(i.quantity, 10) || 1),
    }));

    const order = await dataManager.createOrder({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      city: 'Taourirt',
      address: address.trim(),
      notes: notes?.trim(),
      items: formattedItems,
    });

    return res.status(201).json({ success: true, order });
  } catch (err: any) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message || 'Erreur lors de l enregistrement de la commande.' });
  }
});

// 9. Protected Admin Orders Endpoints
app.get('/api/orders', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const orders = await dataManager.getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes.' });
  }
});

app.get('/api/orders/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const order = await dataManager.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Commande non trouvée.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande.' });
  }
});

app.put('/api/orders/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Statut requis.' });

    const updated = await dataManager.updateOrderStatus(req.params.id, status as OrderStatus);
    if (!updated) return res.status(404).json({ error: 'Commande non trouvée.' });

    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de la commande.' });
  }
});

// 10. Protected Admin Customers Endpoints
app.get('/api/customers', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const customers = await dataManager.getCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des clients.' });
  }
});

app.get('/api/customers/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const customer = await dataManager.getCustomerById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Client non trouvé.' });

    const allOrders = await dataManager.getOrders();
    const customerOrders = allOrders.filter((o) => o.customerId === customer.id);
    res.json({ customer, orders: customerOrders });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du client.' });
  }
});

// 11. Protected Admin Stats Endpoint
app.get('/api/stats', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const stats = await dataManager.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques.' });
  }
});

// ==========================================
// VITE / STATIC SERVING & VERCEL SERVERLESS EXPORT
// ==========================================

export default app;

if (process.env.NODE_ENV !== 'production') {
  createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  }).then((vite) => {
    app.use(vite.middlewares);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[ELECTRO_FENNASSA] Dev server running on http://0.0.0.0:${PORT}`);
    });
  });
} else if (!process.env.VERCEL) {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ELECTRO_FENNASSA] Production server running on http://0.0.0.0:${PORT}`);
  });
}
