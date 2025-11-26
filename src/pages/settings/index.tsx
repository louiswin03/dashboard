import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
  Key,
  Smartphone,
  Mail,
  Save,
  Camera,
} from 'lucide-react';
import { Card, Button, Input, Badge } from '../../components/common';
import { cn, getInitials } from '../../utils';

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Sécurité', icon: Shield },
  { id: 'billing', label: 'Facturation', icon: CreditCard },
  { id: 'appearance', label: 'Apparence', icon: Palette },
];

const notificationSettings = [
  { id: 'email_revenue', label: 'Nouveau revenu', description: 'Recevoir un email pour chaque nouveau revenu', enabled: true },
  { id: 'email_expense', label: 'Nouvelle dépense', description: 'Recevoir un email pour chaque dépense enregistrée', enabled: false },
  { id: 'email_goal', label: 'Objectif atteint', description: 'Être notifié quand un objectif est complété', enabled: true },
  { id: 'email_tax', label: 'Rappels fiscaux', description: 'Recevoir des rappels pour les échéances fiscales', enabled: true },
  { id: 'push_all', label: 'Notifications push', description: 'Activer les notifications push sur tous les appareils', enabled: true },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState(notificationSettings);

  const user = {
    firstName: 'Louis',
    lastName: 'Martin',
    email: 'louis@entreprodash.com',
    phone: '+33 6 12 34 56 78',
    company: 'LM Consulting',
    siret: '123 456 789 00012',
  };

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-semibold">Paramètres</h1>
        <p className="text-text-secondary mt-1">Gérez votre compte et vos préférences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-3">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left',
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-100'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-accent">
                      {getInitials(`${user.firstName} ${user.lastName}`)}
                    </span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-accent text-surface shadow-lg hover:bg-accent-light transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
                  <p className="text-text-muted">{user.company}</p>
                  <Badge variant="accent" className="mt-2">Plan Pro</Badge>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Prénom" defaultValue={user.firstName} />
                <Input label="Nom" defaultValue={user.lastName} />
                <Input label="Email" type="email" defaultValue={user.email} icon={<Mail className="w-4 h-4" />} />
                <Input label="Téléphone" defaultValue={user.phone} icon={<Smartphone className="w-4 h-4" />} />
                <Input label="Entreprise" defaultValue={user.company} />
                <Input label="SIRET" defaultValue={user.siret} />
              </div>

              <div className="flex justify-end mt-8">
                <Button variant="primary">
                  <Save className="w-4 h-4" />
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Préférences de notification</h2>

              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-accent/20 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{notification.label}</p>
                      <p className="text-sm text-text-muted">{notification.description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className={cn(
                        'relative w-12 h-6 rounded-full transition-colors',
                        notification.enabled ? 'bg-accent' : 'bg-surface-200'
                      )}
                    >
                      <div
                        className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                          notification.enabled ? 'translate-x-7' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Sécurité du compte</h2>

              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Key className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Mot de passe</h3>
                      <p className="text-sm text-text-muted">Dernière modification il y a 3 mois</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Modifier le mot de passe</Button>
                </div>

                <div className="p-4 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        <Shield className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Authentification à deux facteurs</h3>
                        <p className="text-sm text-text-muted">Protégez votre compte avec 2FA</p>
                      </div>
                    </div>
                    <Badge variant="success">Activé</Badge>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Globe className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Sessions actives</h3>
                      <p className="text-sm text-text-muted">3 appareils connectés</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Gérer les sessions</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Facturation & Abonnement</h2>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/20 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge variant="accent">Plan Pro</Badge>
                    <h3 className="text-2xl font-semibold mt-2">29€<span className="text-base font-normal text-text-secondary">/mois</span></h3>
                  </div>
                  <Button variant="secondary">Changer de plan</Button>
                </div>
                <p className="text-text-secondary">Prochain renouvellement le 15 janvier 2025</p>
              </div>

              <div className="p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <CreditCard className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Moyen de paiement</h3>
                    <p className="text-sm text-text-muted">Visa •••• 4242</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">Modifier</Button>
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Apparence</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Thème</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['Sombre', 'Clair', 'Système'].map((theme, index) => (
                      <button
                        key={theme}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all',
                          index === 0 
                            ? 'border-accent bg-accent/10' 
                            : 'border-white/10 hover:border-accent/30'
                        )}
                      >
                        <div className={cn(
                          'w-full h-16 rounded-lg mb-3',
                          index === 0 && 'bg-surface-50',
                          index === 1 && 'bg-white',
                          index === 2 && 'bg-gradient-to-r from-surface-50 to-white'
                        )} />
                        <p className="font-medium">{theme}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Couleur d'accent</h3>
                  <div className="flex gap-3">
                    {['#c9a962', '#3b82f6', '#22c55e', '#a855f7', '#ef4444'].map((color, index) => (
                      <button
                        key={color}
                        className={cn(
                          'w-10 h-10 rounded-full transition-transform hover:scale-110',
                          index === 0 && 'ring-2 ring-offset-2 ring-offset-surface ring-accent'
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
