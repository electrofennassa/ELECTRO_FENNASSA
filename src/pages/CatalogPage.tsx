import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, Search, RotateCcw, SlidersHorizontal, X, Sparkles, Tag } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const {
    lang,
    t,
    products,
    categories,
    brands,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    selectedSubCategoryFilter,
    setSelectedSubCategoryFilter,
    selectedBrandFilter,
    setSelectedBrandFilter,
    searchQuery,
    setSearchQuery,
    priceMinFilter,
    setPriceMinFilter,
    priceMaxFilter,
    setPriceMaxFilter,
    onlyPromotionsFilter,
    setOnlyPromotionsFilter,
    onlyNewFilter,
    setOnlyNewFilter,
  } = useApp();

  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'price-asc' | 'price-desc'>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeCategories = categories.filter((c) => c.isActive);
  const activeCatObj = activeCategories.find(
    (c) => c.id === selectedCategoryFilter || c.slug === selectedCategoryFilter
  );

  // Filter logic
  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;

    // Category match
    if (selectedCategoryFilter !== 'all') {
      const matchDirect = p.categoryId === selectedCategoryFilter || p.category === selectedCategoryFilter;
      const matchObj = activeCatObj && (p.categoryId === activeCatObj.id || p.category === activeCatObj.id || p.categoryId === activeCatObj.slug || p.category === activeCatObj.slug);
      if (!matchDirect && !matchObj) {
        return false;
      }
    }
    // Subcategory match
    if (selectedSubCategoryFilter !== 'all') {
      if (p.subCategoryId !== selectedSubCategoryFilter && p.subCategory !== selectedSubCategoryFilter) {
        return false;
      }
    }
    // Brand match
    if (selectedBrandFilter !== 'all') {
      if (p.brand !== selectedBrandFilter && p.brandId !== selectedBrandFilter) {
        return false;
      }
    }
    // Price min match
    if (priceMinFilter !== '' && p.price < Number(priceMinFilter)) {
      return false;
    }
    // Price max match
    if (priceMaxFilter !== '' && p.price > Number(priceMaxFilter)) {
      return false;
    }
    // Only promotions filter
    if (onlyPromotionsFilter && !p.isPromotion && !p.isPromo) {
      return false;
    }
    // Only new filter
    if (onlyNewFilter && !p.isNew) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (p.name[lang] || p.name.fr).toLowerCase();
      const ref = p.reference.toLowerCase();
      const brand = p.brand.toLowerCase();
      const cat = (p.categoryId || '').toLowerCase();
      if (!name.includes(q) && !ref.includes(q) && !brand.includes(q) && !cat.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    return 0; // relevance / default
  });

  const activeCategoryMeta = activeCatObj;

  const resetAllFilters = () => {
    setSelectedCategoryFilter('all');
    setSelectedSubCategoryFilter('all');
    setSelectedBrandFilter('all');
    setSearchQuery('');
    setPriceMinFilter('');
    setPriceMaxFilter('');
    setOnlyPromotionsFilter(false);
    setOnlyNewFilter(false);
  };

  const hasActiveFilters =
    selectedCategoryFilter !== 'all' ||
    selectedSubCategoryFilter !== 'all' ||
    selectedBrandFilter !== 'all' ||
    searchQuery !== '' ||
    priceMinFilter !== '' ||
    priceMaxFilter !== '' ||
    onlyPromotionsFilter ||
    onlyNewFilter;

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-950 border border-blue-800 px-3 py-1 rounded-full">
            ELECTRO_FENNASSA TAOURIRT
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-3">
            {activeCatObj
              ? (activeCatObj.name[lang] || activeCatObj.name.fr)
              : t.catalog}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            {activeCatObj
              ? (activeCatObj.description?.[lang] || activeCatObj.description?.fr || '')
              : lang === 'ar'
              ? 'تصفح جميع الأجهزة المنزلية من أشهر العلامات التجارية العالمية المتاحة بمتجرنا في تاوريرت.'
              : 'Découvrez l ensemble de nos électroménagers disponibles pour livraison immédiate à Taourirt.'}
          </p>
        </div>
      </div>

      {/* Main Filter & Search Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>{lang === 'ar' ? 'فلاتر البحث' : 'Filtres de recherche'}</span>
            </h2>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetFilters}</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {lang === 'ar' ? 'الأقسام' : 'Catégories'}
            </label>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setSelectedSubCategoryFilter('all');
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{t.allCategories}</span>
                <span className="text-[10px] opacity-80">({products.length})</span>
              </button>
              {activeCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryFilter(cat.id);
                    setSelectedSubCategoryFilter('all');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCategoryFilter === cat.id || selectedCategoryFilter === cat.slug
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.name[lang] || cat.name.fr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Filter (if category selected) */}
          {activeCategoryMeta && (
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                {lang === 'ar' ? 'الفئات الفرعية' : 'Sous-catégories'}
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedSubCategoryFilter('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedSubCategoryFilter === 'all'
                      ? 'bg-blue-100 text-blue-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Tous
                </button>
                {activeCategoryMeta.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubCategoryFilter(sub.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedSubCategoryFilter === sub.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {sub.title[lang]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brand Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {lang === 'ar' ? 'العلامة التجارية' : 'Marque'}
            </label>
            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className="w-full bg-slate-100 text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
            >
              <option value="all">{t.allBrands}</option>
              {brands.filter((b) => b.isActive).map((b) => (
                <option key={b.id || b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {lang === 'ar' ? 'السعر (درهم)' : 'Prix (DH)'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder={t.minPrice}
                value={priceMinFilter}
                onChange={(e) => setPriceMinFilter(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-100 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
              <input
                type="number"
                placeholder={t.maxPrice}
                value={priceMaxFilter}
                onChange={(e) => setPriceMaxFilter(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-100 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Badges Checkboxes */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              {lang === 'ar' ? 'خصائص' : 'Filtres spéciaux'}
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 hover:text-blue-600">
              <input
                type="checkbox"
                checked={onlyPromotionsFilter}
                onChange={(e) => setOnlyPromotionsFilter(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <Tag className="w-3.5 h-3.5 text-rose-500" />
              <span>{lang === 'ar' ? 'التخفيضات فقط' : 'Promotions uniquement'}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 hover:text-blue-600">
              <input
                type="checkbox"
                checked={onlyNewFilter}
                onChange={(e) => setOnlyNewFilter(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'ar' ? 'المنتجات الجديدة' : 'Nouveautés uniquement'}</span>
            </label>
          </div>
        </aside>

        {/* Main Product Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search, Mobile Filter Toggle & Sort Header */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-slate-100 text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>{lang === 'ar' ? 'الفلاتر' : 'Filtres'}</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-100 text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-semibold"
              >
                <option value="newest">{t.sortNewest}</option>
                <option value="relevance">{lang === 'ar' ? 'الصلة' : 'Pertinence'}</option>
                <option value="price-asc">{t.sortPriceAsc}</option>
                <option value="price-desc">{t.sortPriceDesc}</option>
              </select>
            </div>

            {/* Active Filters Bar & Reset */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>
                <strong>{sortedProducts.length}</strong> {t.resultsCount}
              </span>

              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetFilters}</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-xs">
              <SlidersHorizontal className="w-12 h-12 stroke-1 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-900 text-lg">
                {lang === 'ar'
                  ? 'Aucun produit ne correspond à votre recherche.'
                  : 'Aucun produit ne correspond à votre recherche.'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'ar'
                  ? 'جرب تغيير فلاتر البحث أو اضغط على إعادة الضبط لعرض كافة أجهزتنا.'
                  : 'Essayez de modifier vos critères de recherche ou réinitialisez les filtres.'}
              </p>
              <button
                onClick={resetAllFilters}
                className="bg-slate-900 text-white font-bold text-xs px-6 py-3 rounded-full hover:bg-blue-600 transition-colors shadow-md"
              >
                {t.resetFilters}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-4/5 max-w-xs h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <span>{lang === 'ar' ? 'فلاتر البحث' : 'Filtres de recherche'}</span>
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase">
                  {lang === 'ar' ? 'الأقسام' : 'Catégorie'}
                </label>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value as any);
                    setSelectedSubCategoryFilter('all');
                  }}
                  className="w-full bg-slate-100 text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200"
                >
                  <option value="all">{t.allCategories}</option>
                  {activeCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name[lang] || cat.name.fr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase">
                  {lang === 'ar' ? 'الماركة' : 'Marque'}
                </label>
                <select
                  value={selectedBrandFilter}
                  onChange={(e) => setSelectedBrandFilter(e.target.value)}
                  className="w-full bg-slate-100 text-slate-900 text-xs px-3 py-2.5 rounded-xl border border-slate-200"
                >
                  <option value="all">{t.allBrands}</option>
                  {brands.filter((b) => b.isActive).map((b) => (
                    <option key={b.id || b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block uppercase">
                  {lang === 'ar' ? 'السعر (درهم)' : 'Prix (DH)'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMinFilter}
                    onChange={(e) => setPriceMinFilter(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-slate-100 text-xs p-2 rounded-xl border border-slate-200"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMaxFilter}
                    onChange={(e) => setPriceMaxFilter(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-slate-100 text-xs p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Promotions & New checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyPromotionsFilter}
                    onChange={(e) => setOnlyPromotionsFilter(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Promotions uniquement</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={onlyNewFilter}
                    onChange={(e) => setOnlyNewFilter(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Nouveautés uniquement</span>
                </label>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-xl"
              >
                {lang === 'ar' ? 'تطبيق الفلاتر' : 'Appliquer les filtres'}
              </button>
              <button
                onClick={() => {
                  resetAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="w-full bg-slate-100 text-slate-700 font-bold text-xs py-2.5 rounded-xl"
              >
                {t.resetFilters}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
