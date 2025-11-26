import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/common';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setFormError('Email ou mot de passe incorrect');
        return;
      }

      // Redirection vers le dashboard après connexion réussie
      navigate('/');
    } catch (err) {
      setFormError('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface via-surface-50 to-surface p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-light mb-4">
            <Sparkles className="w-8 h-8 text-surface" />
          </div>
          <h1 className="text-3xl font-display font-semibold mb-2">
            Bon retour!
          </h1>
          <p className="text-text-secondary">
            Connectez-vous à votre compte EntreproDash
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Mot de passe
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-accent hover:text-accent-light transition-colors"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-surface-100 text-accent focus:ring-accent focus:ring-offset-0"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-text-secondary">
                Se souvenir de moi
              </label>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-surface-50 text-text-muted">
                OU
              </span>
            </div>
          </div>

          {/* Social login (optional) */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                // Pour une future intégration Google OAuth
                alert('Connexion Google - À implémenter');
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuer avec Google
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Pas encore de compte?{' '}
              <Link
                to="/register"
                className="text-accent hover:text-accent-light font-medium transition-colors"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Help */}
        <p className="text-xs text-text-muted text-center mt-6">
          Besoin d'aide?{' '}
          <a href="#" className="text-accent hover:text-accent-light">
            Contactez le support
          </a>
        </p>
      </motion.div>
    </div>
  );
}
