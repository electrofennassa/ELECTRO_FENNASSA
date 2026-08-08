# ⚡ ELECTRO_FENNASSA - Plateforme E-Commerce pour Magasin d'Électroménager (Taourirt, Maroc)

Bienvenue sur le projet **ELECTRO_FENNASSA**, la plateforme e-commerce moderne dédiée au magasin d'électroménager leader à Taourirt.

---

## 🚀 Architecture Technique (Vercel + Supabase)

- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS + Motion
- **Backend API** : Node.js / Express compatible Serverless Vercel (`/api/*`)
- **Base de Données** : Supabase PostgreSQL (avec fallback local JSON pour le développement hors-ligne)
- **Authentification Admin** : JWT Stateless sécurisé (`jsonwebtoken`)
- **Règle Métier Absolue** : **Aucune gestion de stock ou d'inventaire**.

---

## 🔑 Variables d'Environnement (`.env` ou Configuration Vercel)

Créer un fichier `.env` à la racine (ou ajouter ces variables dans le Dashboard Vercel) :

```env
# Supabase PostgreSQL
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Authentification Admin
ADMIN_EMAIL=admin@electrofennassa.ma
ADMIN_PASSWORD=votre_mot_de_passe_robuste
JWT_SECRET=votre_cle_secrete_jwt_robuste_2026

# Gemini AI (Optionnel)
GEMINI_API_KEY=votre_cle_gemini

# Application
APP_URL=https://electrofennassa.vercel.app
NODE_ENV=production
```

> **Note de Sécurité** : `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `JWT_SECRET` et `GEMINI_API_KEY` sont strictement confidentiels et ne doivent **jamais** être exposés au frontend ni préfixés par `VITE_`.

---

## 🗄️ Configuration de la Base de Données Supabase

1. Créez un projet sur [Supabase](https://supabase.com).
2. Rendez-vous dans **SQL Editor** sur Supabase.
3. Copiez le contenu du fichier `supabase/schema.sql` présent dans ce dépôt et exécutez le script SQL.
4. Ce script crée l'ensemble des tables (`categories`, `brands`, `products`, `promotions`, `packs`, `customers`, `orders`, `order_items`) ainsi que les politiques RLS.

---

## 📦 Migration des Données de `data/db.json` vers Supabase

Un script dédié permet d'importer automatiquement le catalogue, les clients et l'historique des commandes vers Supabase :

```bash
# Assurez-vous d'avoir défini SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
npx tsx scripts/migrate-to-supabase.ts
```

---

## 🛠️ Développement Local

```bash
# 1. Installation des dépendances
npm install

# 2. Lancement du serveur de développement (Express + Vite)
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

---

## ☁️ Déploiement sur Vercel

1. Poussez le code sur GitHub.
2. Connectez le dépôt à **Vercel**.
3. Dans la section **Environment Variables** de Vercel, ajoutez :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `GEMINI_API_KEY` (si utilisé)
4. Cliquez sur **Deploy**. Vercel utilisera `vercel.json` pour déployer le frontend SPA et l'API Serverless sur `/api/*`.

---

## 📡 Documentation des Endpoints API (`/api/*`)

### Publiques
- `GET /api/health` : État de santé et backend actif.
- `GET /api/products` : Liste des produits.
- `GET /api/categories` : Liste des catégories.
- `GET /api/brands` : Liste des marques.
- `GET /api/promotions` : Offres promotionnelles.
- `GET /api/packs` : Packs promotionnels.
- `POST /api/orders` : Validation et création de commande avec calcul des prix strictement serveur.

### Authentification & Administration (Protégées par JWT Stateless)
- `POST /api/auth/login` : Connexion admin et délivrance de token JWT.
- `GET /api/auth/me` : Vérification du statut de connexion admin.
- `POST /api/auth/logout` : Déconnexion.
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` : Gestion produits.
- `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id` : Gestion catégories.
- `POST /api/brands`, `PUT /api/brands/:id`, `DELETE /api/brands/:id` : Gestion marques.
- `POST /api/promotions`, `PUT /api/promotions/:id`, `DELETE /api/promotions/:id` : Gestion promotions.
- `POST /api/packs`, `PUT /api/packs/:id`, `DELETE /api/packs/:id` : Gestion packs.
- `GET /api/orders`, `GET /api/orders/:id`, `PUT /api/orders/:id/status` : Gestion des commandes clients.
- `GET /api/customers`, `GET /api/customers/:id` : Gestion du répertoire client.
- `GET /api/stats` : Statistiques du tableau de bord.
