import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building2, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/common';

export default function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
  });

  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company_name: formData.companyName,
            full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          },
        },
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      // Redirection vers le dashboard après inscription réussie
      navigate('/');
    } catch (err) {
      setFormError('Une erreur est survenue lors de l\'inscription');
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
            Créer un compte
          </h1>
          <p className="text-text-secondary">
            Rejoignez EntreproDash et gérez votre activité
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-colors"
                    placeholder="Louis"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-colors"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            </div>

            {/* Company name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom de l'entreprise <span className="text-text-muted">(optionnel)</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="Mon Entreprise"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-text-muted mt-1">
                Minimum 8 caractères
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-surface-100 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
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
                  Création du compte...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Vous avez déjà un compte?{' '}
              <Link
                to="/login"
                className="text-accent hover:text-accent-light font-medium transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-text-muted text-center mt-6">
          En créant un compte, vous acceptez nos{' '}
          <a href="#" className="text-accent hover:text-accent-light">
            Conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="#" className="text-accent hover:text-accent-light">
            Politique de confidentialité
          </a>
        </p>
      </motion.div>
    </div>
  );
}
