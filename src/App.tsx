import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { PacksPage } from './pages/PacksPage';
import { PackDetailPage } from './pages/PackDetailPage';
import { BrandsPage } from './pages/BrandsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { FAQPage } from './pages/FAQPage';
import { WishlistPage } from './pages/WishlistPage';
import { InfoPages } from './pages/InfoPages';
import { AdminPage } from './pages/AdminPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

const MainContent: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'catalog':
      case 'gros-electromenager':
      case 'petit-electromenager':
        return <CatalogPage />;
      case 'promotions':
        return <PromotionsPage />;
      case 'packs':
        return <PacksPage />;
      case 'pack-detail':
        return <PackDetailPage />;
      case 'marques':
        return <BrandsPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'confirmation':
        return <OrderConfirmationPage />;
      case 'contact':
        return <ContactPage />;
      case 'about':
        return <AboutPage />;
      case 'delivery':
        return <DeliveryPage />;
      case 'faq':
        return <FAQPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'warranty':
        return <InfoPages type="warranty" />;
      case 'terms':
        return <InfoPages type="terms" />;
      case 'privacy':
        return <InfoPages type="privacy" />;
      case 'returns':
        return <InfoPages type="returns" />;
      case 'admin-login':
        return <AdminLoginPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      <div>
        <Header />
        <main className="max-w-7xl mx-auto px-4 pt-6 sm:pt-8">{renderPage()}</main>
      </div>

      <Footer />
      <FloatingWhatsApp />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
