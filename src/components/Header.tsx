import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { PageRoute } from '../types';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Tag,
  Package,
  CheckCircle2,
  Globe,
  Heart,
  HelpCircle,
  Truck,
  Info,
  History,
  ShieldCheck,
  Grid,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    currentPage,
    setCurrentPage,
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    setSelectedSubCategoryFilter,
    products,
    setSelectedProduct,
    wishlist,
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const activeCategories = categories.filter((c) => c.isActive);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          const name = p.name[lang].toLowerCase();
          const ref = p.reference.toLowerCase();
          const brand = p.brand.toLowerCase();
          return name.includes(q) || ref.includes(q) || brand.includes(q);
        })
        .slice(0, 5)
    : [];

  const handleCategoryNav = (catId: string) => {
    setSelectedCategoryFilter(catId);
    setSelectedSubCategoryFilter('all');
    setCurrentPage('catalog');
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks: { id: PageRoute; label: string; badge?: string }[] = [
    { id: 'home', label: t.home },
    { id: 'catalog', label: t.catalog },
    { id: 'promotions', label: t.promotions, badge: 'PROMO' },
    { id: 'packs', label: t.packs, badge: 'PACK' },
    { id: 'marques', label: t.marques },
    { id: 'delivery', label: lang === 'ar' ? 'التوصيل' : 'Livraison' },
    { id: 'faq', label: lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ' },
    { id: 'about', label: t.about },
    { id: 'contact', label: t.contact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner - Local Taourirt Notice & Phone & Language Selector */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Location & Delivery info */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={COMPANY_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:underline"
              title="Voir la localisation sur Google Maps"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>📍 Nous trouver à Taourirt</span>
            </a>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{COMPANY_INFO.deliveryZone[lang]}</span>
            </span>
          </div>

          {/* Right: Phone, Hours & Language switch */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.openHours}</span>
            </span>

            <a
              href={`tel:${COMPANY_INFO.phone.raw}`}
              className="inline-flex items-center gap-1 font-semibold text-white hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span dir="ltr">{COMPANY_INFO.phone.display}</span>
            </a>

            {/* Language Selector FR / AR */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  lang === 'fr'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  lang === 'ar'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                العربية
              </button>
            </div>

            {/* Admin Quick Button */}
            <button
              onClick={() => {
                setCurrentPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 rounded-lg text-[11px] font-bold transition-all shadow-xs"
              title="Accéder à l'Espace Administration"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Mobile menu toggle button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <button
          onClick={() => {
            setCurrentPage('home');
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            EF
          </div>
          <div>
            <span className="block font-black text-xl sm:text-2xl tracking-tight text-slate-900 leading-none group-hover:text-blue-700 transition-colors">
              ELECTRO<span className="text-blue-600 font-extrabold">_FENNASSA</span>
            </span>
            <span className="block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Taourirt • Électroménager
            </span>
          </div>
        </button>

        {/* Live Search Bar (Desktop & Tablet) */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-md relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-900 text-sm pl-10 pr-4 py-2.5 rounded-full border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {searchResults.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => {
                        setSelectedProduct(prod);
                        setCurrentPage('product-detail');
                        setIsSearchFocused(false);
                      }}
                      className="w-full p-2.5 flex items-center gap-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                    >
                      <img
                        src={prod.mainImage}
                        alt={prod.name[lang]}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                          {prod.brand}
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {prod.name[lang]}
                        </p>
                        <p className="text-xs text-slate-500">{prod.reference}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-900">
                          {prod.price.toLocaleString('fr-FR')} DH
                        </span>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setCurrentPage('catalog');
                      setIsSearchFocused(false);
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors mt-1"
                  >
                    Voir tous les résultats ({searchResults.length}+)
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-sm">
                  Aucun produit trouvé pour &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right CTA Group: Wishlist + WhatsApp + Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist Button */}
          <button
            onClick={() => setCurrentPage('wishlist')}
            className={`relative p-2.5 rounded-full border transition-all ${
              wishlist.length > 0
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            aria-label="Favoris"
            title="Mes favoris"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Quick WhatsApp Header Button */}
          <a
            href={COMPANY_INFO.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3.5 py-2 rounded-full font-bold text-xs shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            <span>{t.whatsappFast}</span>
          </a>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-slate-900 text-white hover:bg-blue-600 rounded-full shadow-md transition-all active:scale-95 flex items-center justify-center"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-100 text-slate-900 text-sm pl-9 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:border-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Navigation Menu Bar (Desktop) */}
      <nav className="hidden lg:block bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;

              // Insert Categories Dropdown right after Catalogue
              if (link.id === 'catalog') {
                return (
                  <React.Fragment key="catalog-group">
                    <button
                      key={link.id}
                      onClick={() => {
                        setSelectedCategoryFilter('all');
                        setSelectedSubCategoryFilter('all');
                        setCurrentPage('catalog');
                      }}
                      className={`px-3.5 py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                        isActive && selectedCategoryFilter === 'all'
                          ? 'border-blue-600 text-blue-600 font-bold bg-white'
                          : 'border-transparent hover:text-blue-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{link.label}</span>
                    </button>

                    {/* Dynamic Categories Dropdown Menu */}
                    <div
                      className="relative"
                      onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                      onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                    >
                      <button
                        onClick={() => {
                          setCurrentPage('catalog');
                          setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                        }}
                        className={`px-3.5 py-3 flex items-center gap-1.5 border-b-2 transition-colors ${
                          currentPage === 'catalog' && selectedCategoryFilter !== 'all'
                            ? 'border-blue-600 text-blue-600 font-bold bg-white'
                            : 'border-transparent hover:text-blue-600 hover:bg-slate-100'
                        }`}
                      >
                        <Grid className="w-4 h-4 text-blue-600" />
                        <span>{lang === 'ar' ? 'الأقسام' : 'Nos Catégories'}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {isCategoryDropdownOpen && (
                        <div className="absolute left-0 top-full w-64 bg-white rounded-b-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                          {activeCategories.length > 0 ? (
                            activeCategories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => handleCategoryNav(cat.id)}
                                className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors ${
                                  selectedCategoryFilter === cat.id || selectedCategoryFilter === cat.slug
                                    ? 'bg-blue-50 text-blue-700 font-bold'
                                    : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                                }`}
                              >
                                <span>{cat.name[lang] || cat.name.fr}</span>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-xs text-slate-400">
                              {lang === 'ar' ? 'لا توجد أقسام متاحة' : 'Aucune catégorie disponible'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              }

              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                  className={`px-3.5 py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'border-blue-600 text-blue-600 font-bold bg-white'
                      : 'border-transparent hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-black rounded-full uppercase ${
                        link.badge === 'PROMO'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage('admin')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 py-3"
          >
            {t.admin}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="font-black text-lg text-slate-900">ELECTRO_FENNASSA</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Language Switcher */}
              <div className="my-4 p-2 bg-slate-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Globe className="w-4 h-4" /> Langue / اللغة
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setLang('fr')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      lang === 'fr' ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => setLang('ar')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      lang === 'ar' ? 'bg-blue-600 text-white' : 'text-slate-600'
                    }`}
                  >
                    العربية
                  </button>
                </div>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-1 py-2">
                {navLinks.map((link) => {
                  if (link.id === 'catalog') {
                    return (
                      <React.Fragment key="mobile-catalog-group">
                        <button
                          key={link.id}
                          onClick={() => {
                            setSelectedCategoryFilter('all');
                            setSelectedSubCategoryFilter('all');
                            setCurrentPage('catalog');
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                            currentPage === 'catalog' && selectedCategoryFilter === 'all'
                              ? 'bg-blue-50 text-blue-600 font-bold'
                              : 'text-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          <span>{link.label}</span>
                        </button>

                        {/* Category List in Mobile Drawer */}
                        {activeCategories.length > 0 && (
                          <div className="pl-4 pr-2 py-1 my-1 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 pt-1">
                              {lang === 'ar' ? 'الأقسام' : 'Rayons & Catégories'}
                            </span>
                            {activeCategories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => handleCategoryNav(cat.id)}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                                  selectedCategoryFilter === cat.id || selectedCategoryFilter === cat.slug
                                    ? 'bg-blue-600 text-white font-bold'
                                    : 'text-slate-700 hover:bg-slate-200/60'
                                }`}
                              >
                                <span>{cat.name[lang] || cat.name.fr}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  }

                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setCurrentPage(link.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                        currentPage === link.id
                          ? 'bg-blue-50 text-blue-600 font-bold'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500 text-white">
                          {link.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    setCurrentPage('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50 border-t border-slate-100 mt-2 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Espace Administration
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-900">{COMPANY_INFO.address.full}</p>
              <p className="flex items-center gap-1 font-bold text-emerald-600">
                <Phone className="w-3.5 h-3.5" /> {COMPANY_INFO.phone.display}
              </p>
              <a
                href={COMPANY_INFO.whatsapp.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 text-white text-center py-2.5 rounded-xl font-bold block mt-2"
              >
                Commander sur WhatsApp
              </a>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
