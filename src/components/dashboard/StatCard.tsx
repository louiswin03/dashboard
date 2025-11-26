import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn, formatCurrency, formatPercent } from '../../utils';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  format?: 'currency' | 'number' | 'percent';
  delay?: number;
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs mois dernier',
  icon: Icon,
  format = 'currency',
  delay = 0,
}: StatCardProps) {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percent':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('fr-FR');
    }
  };

  const getChangeIcon = () => {
    if (!change) return <Minus className="w-3.5 h-3.5" />;
    return change > 0 ? (
      <TrendingUp className="w-3.5 h-3.5" />
    ) : (
      <TrendingDown className="w-3.5 h-3.5" />
    );
  };

  const getChangeColor = () => {
    if (!change) return 'text-text-muted';
    return change > 0 ? 'text-success' : 'text-danger';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card-hover p-6 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 text-sm font-medium',
            getChangeColor()
          )}>
            {getChangeIcon()}
            <span>{formatPercent(change)}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <p className="text-2xl font-semibold tracking-tight">{formatValue()}</p>
        
        {change !== undefined && (
          <p className="text-xs text-text-muted">{changeLabel}</p>
        )}
      </div>

      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
}
