import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { loginAdmin } from '../lib/api';
import { Lock, Mail, ArrowRight, ShieldCheck, Home } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { lang, t, setCurrentPage, addToast, setIsAdminAuthenticated } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    try {
      await loginAdmin(email, password);
      setIsAdminAuthenticated(true);
      addToast(
        lang === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Connexion à l administration réussie',
        'success'
      );
      setCurrentPage('admin');
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Espace Administration
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            ELECTRO_FENNASSA • Taourirt
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Adresse E-mail Admin
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@electrofennassa.ma"
                  required
                  className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-mono"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 text-slate-900 text-xs pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-4 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure Notice */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Accès réservé au personnel
            </span>
            <span>EF-ADMIN v3.0</span>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xs text-slate-500 hover:text-slate-900 font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Retour à la boutique</span>
          </button>
        </div>
      </div>
    </div>
  );
};
