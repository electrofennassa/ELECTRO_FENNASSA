import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { dataManager } from './server/dataManager.ts';
import { OrderStatus } from './src/types.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable JSON parsing
app.use(express.json({ limit: '10mb' }));

// CORS & Security Headers Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

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
// API ROUTER (Handles both /api/* and /* paths for Vercel Serverless)
// ==========================================
const apiRouter = express.Router();

// 1. Health check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    ok: true,
    service: 'ELECTRO_FENNASSA_API',
    status: 'ok',
    store: 'ELECTRO_FENNASSA',
    city: 'Taourirt',
    storage: process.env.SUPABASE_URL ? 'Supabase PostgreSQL' : 'Local JSON Fallback',
  });
});

// 2. Admin Authentication (Stateless JWT)
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Veuillez saisir un e-mail et un mot de passe.' });
    }

    if (email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim() && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email: ADMIN_EMAIL, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Also set HttpOnly cookie for browser security
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
  } catch (err: any) {
    console.error('Login route error:', err);
    return res.status(500).json({
      error: 'Erreur serveur lors de la connexion',
      details: process.env.NODE_ENV === 'production' ? undefined : err.message,
    });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
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

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Déconnexion réussie.' });
});

// 3. Products Endpoints
apiRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await dataManager.getProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits.' });
  }
});

apiRouter.post('/products', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const newProduct = await dataManager.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la création du produit.' });
  }
});

apiRouter.put('/products/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Produit non trouvé.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/products/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deleteProduct(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Produit non trouvé.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Categories Endpoints
apiRouter.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await dataManager.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories.' });
  }
});

apiRouter.post('/categories', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const cat = await dataManager.createCategory(req.body);
    res.status(201).json(cat);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Catégorie non trouvée.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/categories/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deleteCategory(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Catégorie non trouvée.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Brands Endpoints
apiRouter.get('/brands', async (req: Request, res: Response) => {
  try {
    const brands = await dataManager.getBrands();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des marques.' });
  }
});

apiRouter.post('/brands', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const brand = await dataManager.createBrand(req.body);
    res.status(201).json(brand);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/brands/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updateBrand(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Marque non trouvée.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/brands/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deleteBrand(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Marque non trouvée.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Promotions Endpoints
apiRouter.get('/promotions', async (req: Request, res: Response) => {
  try {
    const promotions = await dataManager.getPromotions();
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des promotions.' });
  }
});

apiRouter.post('/promotions', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const promo = await dataManager.createPromotion(req.body);
    res.status(201).json(promo);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/promotions/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updatePromotion(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Promotion non trouvée.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/promotions/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deletePromotion(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Promotion non trouvée.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Packs Endpoints
apiRouter.get('/packs', async (req: Request, res: Response) => {
  try {
    const packs = await dataManager.getPacks();
    res.json(packs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des packs.' });
  }
});

apiRouter.post('/packs', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const pack = await dataManager.createPack(req.body);
    res.status(201).json(pack);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/packs/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const updated = await dataManager.updatePack(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Pack non trouvé.' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/packs/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const ok = await dataManager.deletePack(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Pack non trouvé.' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Public Order Placement Endpoint
apiRouter.post('/orders', async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, city, address, notes, items } = req.body || {};

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

    // Format items array
    const formattedItems = items.map((i: any) => ({
      productId: String(i.productId || i.id || ''),
      quantity: Math.max(1, parseInt(i.quantity, 10) || 1),
      productName: typeof i.productName === 'string' ? i.productName : undefined,
      productReference: typeof i.productReference === 'string' ? i.productReference : undefined,
      price: typeof i.price === 'number' ? i.price : parseFloat(i.price) || undefined,
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
apiRouter.get('/orders', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const orders = await dataManager.getOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes.' });
  }
});

apiRouter.get('/orders/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const order = await dataManager.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Commande non trouvée.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la commande.' });
  }
});

apiRouter.put('/orders/:id/status', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: 'Statut requis.' });

    const updated = await dataManager.updateOrderStatus(req.params.id, status as OrderStatus);
    if (!updated) return res.status(404).json({ error: 'Commande non trouvée.' });

    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de la commande.' });
  }
});

// 10. Protected Admin Customers Endpoints
apiRouter.get('/customers', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const customers = await dataManager.getCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des clients.' });
  }
});

apiRouter.get('/customers/:id', requireAdminAuth, async (req: Request, res: Response) => {
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
apiRouter.get('/stats', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const stats = await dataManager.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques.' });
  }
});

// Mount router on both /api and / to handle all Vercel rewrite shapes
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Fallback 404 handler for unmatched API routes (guarantees JSON output)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api') || req.headers.accept?.includes('application/json')) {
    return res.status(404).json({ error: `Route API non trouvée: ${req.method} ${req.originalUrl || req.url}` });
  }
  next();
});

// Global Error Handler Middleware (ALWAYS returns JSON for API requests)
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('🔴 [UNHANDLED EXPRESS ERROR]:', err);
  res.setHeader('Content-Type', 'application/json');
  return res.status(500).json({
    error: 'Erreur interne du serveur',
    details: process.env.NODE_ENV === 'production' ? undefined : err?.message || String(err),
  });
});

// ==========================================
// VITE / STATIC SERVING & VERCEL SERVERLESS EXPORT
// ==========================================

export default app;

if (!process.env.VERCEL) {
  if (process.env.NODE_ENV !== 'production') {
    import('vite').then(({ createServer: createViteServer }) => {
      createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      }).then((vite) => {
        app.use(vite.middlewares);
        app.listen(PORT, '0.0.0.0', () => {
          console.log(`[ELECTRO_FENNASSA] Dev server running on http://0.0.0.0:${PORT}`);
        });
      });
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[ELECTRO_FENNASSA] Production server running on http://0.0.0.0:${PORT}`);
    });
  }
}
