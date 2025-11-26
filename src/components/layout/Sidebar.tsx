import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Calendar,
  FolderKanban,
  Receipt,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Gem,
} from 'lucide-react';
import { cn } from '../../utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'revenus', label: 'Revenus', icon: Wallet, path: '/revenus' },
  { id: 'investissements', label: 'Investissements', icon: TrendingUp, path: '/investissements' },
  { id: 'agenda', label: 'Agenda', icon: Calendar, path: '/agenda' },
  { id: 'projets', label: 'Projets', icon: FolderKanban, path: '/projets' },
  { id: 'fiscalite', label: 'Fiscalité', icon: Receipt, path: '/fiscalite' },
];

const bottomItems = [
  { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings' },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen bg-surface-50 border-r border-white/5 flex flex-col z-50"
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <motion.div
          className="flex items-center gap-3"
          animate={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-glow-sm">
            <Gem className="w-5 h-5 text-surface" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-display text-xl font-semibold tracking-tight"
            >
              Entrepro<span className="text-accent">Dash</span>
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-100'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <Icon className={cn(
                  'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                  isActive && 'scale-110'
                )} />

                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-surface-100 rounded-lg text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-elevated z-50">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="py-4 px-3 border-t border-white/5 space-y-1">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className="block"
            >
              <div
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-100'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </div>
            </NavLink>
          );
        })}

        {/* Logout button */}
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:text-danger hover:bg-danger/10 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-24 w-6 h-6 bg-surface-100 border border-white/10 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-accent/50 transition-all duration-200 shadow-md"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </motion.aside>
  );
}
