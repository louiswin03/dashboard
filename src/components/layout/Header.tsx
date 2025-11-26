import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Moon,
  HelpCircle,
} from 'lucide-react';
import { cn, getInitials } from '../../utils';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock user data
  const user = {
    firstName: 'Louis',
    lastName: 'Martin',
    email: 'louis@entreprodash.com',
    avatar: null,
  };

  const notifications = [
    { id: 1, title: 'Nouveau paiement reçu', message: 'Client ABC - 2 500€', time: '5 min', unread: true },
    { id: 2, title: 'Objectif atteint !', message: 'Épargne mensuelle complétée', time: '1h', unread: true },
    { id: 3, title: 'Rappel', message: 'Déclaration TVA dans 3 jours', time: '2h', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-20 bg-surface/80 backdrop-blur-xl border-b border-white/5 z-40 transition-all duration-300',
        sidebarCollapsed ? 'left-20' : 'left-[280px]'
      )}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div
            className={cn(
              'relative flex items-center transition-all duration-300',
              searchFocused && 'scale-[1.02]'
            )}
          >
            <Search className="absolute left-4 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Rechercher transactions, investissements..."
              className="w-full pl-12 pr-4 py-3 bg-surface-100 border border-white/5 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all duration-200"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <kbd className="absolute right-4 px-2 py-1 bg-surface-200 rounded text-xs text-text-muted font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className={cn(
                'relative p-3 rounded-xl transition-all duration-200',
                showNotifications
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-100'
              )}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-surface-50 border border-white/10 rounded-2xl shadow-elevated overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <span className="badge-accent">{unreadCount} nouvelles</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          'px-4 py-3 border-b border-white/5 hover:bg-surface-100 transition-colors cursor-pointer',
                          notif.unread && 'bg-accent/5'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <span className="w-2 h-2 mt-2 bg-accent rounded-full flex-shrink-0" />
                          )}
                          <div className={cn(!notif.unread && 'ml-5')}>
                            <p className="font-medium text-sm">{notif.title}</p>
                            <p className="text-sm text-text-secondary">{notif.message}</p>
                            <p className="text-xs text-text-muted mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-white/5">
                    <button className="w-full text-center text-sm text-accent hover:text-accent-light transition-colors">
                      Voir toutes les notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-white/10 mx-2" />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className={cn(
                'flex items-center gap-3 p-2 pr-4 rounded-xl transition-all duration-200',
                showProfile
                  ? 'bg-accent/10'
                  : 'hover:bg-surface-100'
              )}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-accent">
                    {getInitials(`${user.firstName} ${user.lastName}`)}
                  </span>
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-text-muted">Entrepreneur</p>
              </div>
              <ChevronDown className={cn(
                'w-4 h-4 text-text-muted transition-transform duration-200',
                showProfile && 'rotate-180'
              )} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-surface-50 border border-white/10 rounded-2xl shadow-elevated overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-text-muted">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-colors">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Mon profil</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-colors">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Paramètres</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-colors">
                      <Moon className="w-4 h-4" />
                      <span className="text-sm">Mode sombre</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-100 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm">Aide & Support</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-white/5">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-danger hover:bg-danger/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Déconnexion</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
