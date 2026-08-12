import React from 'react';
import { useApp } from '../context/AppContext';
import { COMPANY_INFO } from '../data/companyInfo';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { handleImageError } from '../utils/imageUtils';

export const CartDrawer: React.FC = () => {
  const {
    lang,
    t,
    cart,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    setCurrentPage,
  } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">{t.cartTitle}</h2>
              <p className="text-xs text-slate-500">
                {cart.length} {cart.length === 1 ? 'article' : 'articles'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local Delivery Banner */}
        <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800 font-medium">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{COMPANY_INFO.deliveryZone[lang]}</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingBag className="w-16 h-16 stroke-1 mb-3 text-slate-300" />
              <p className="font-bold text-slate-700 text-base">{t.cartEmpty}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {lang === 'ar'
                  ? 'تصفح الكتالوج وأضف المنتجات إلى سلتك'
                  : 'Découvrez notre catalogue et ajoutez vos électroménagers.'}
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCurrentPage('catalog');
                }}
                className="mt-5 bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                {t.exploreCatalog}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80"
              >
                <img
                  src={item.product.image1 || item.product.mainImage || item.product.images?.[0] || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'}
                  alt={item.product.name[lang]}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0 bg-white"
                  onError={handleImageError}
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    {item.product.brand}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.product.name[lang]}
                  </h4>
                  <p className="text-xs font-black text-slate-900 mt-1">
                    {item.product.price.toLocaleString('fr-FR')} DH
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-300 bg-white rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-slate-100 text-slate-600"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title={t.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-slate-900">
                    {(item.product.price * item.quantity).toLocaleString('fr-FR')} DH
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t.subtotal}</span>
                <span className="font-semibold text-slate-900">
                  {cartTotal.toLocaleString('fr-FR')} DH
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t.deliveryCost}</span>
                <span className="font-bold text-emerald-600">
                  {t.freeTaourirtDelivery}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>{t.total}</span>
                <span className="text-blue-700">
                  {cartTotal.toLocaleString('fr-FR')} DH
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setCurrentPage('checkout');
              }}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>{t.proceedToCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
