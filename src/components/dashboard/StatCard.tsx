import { motion, useSpring, useTransform } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn, formatCurrency, formatPercent } from '../../utils';
import { useEffect } from 'react';

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
  // Animated counter
  const spring = useSpring(0, { stiffness: 50, damping: 30 });
  const display = useTransform(spring, (current) => {
    switch (format) {
      case 'currency':
        return formatCurrency(Math.round(current));
      case 'percent':
        return `${current.toFixed(1)}%`;
      default:
        return Math.round(current).toLocaleString('fr-FR');
    }
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

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
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        y: -8,
        boxShadow: '0 20px 60px -12px rgba(201, 169, 98, 0.25)'
      }}
      className="relative p-6 group bg-gradient-to-br from-surface-50 to-surface-100 rounded-2xl border border-white/5 overflow-hidden"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 text-accent"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>

          {change !== undefined && (
            <motion.div
              className={cn(
                'flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg',
                getChangeColor(),
                change > 0 ? 'bg-success/10' : change < 0 ? 'bg-danger/10' : 'bg-surface-200'
              )}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
            >
              {getChangeIcon()}
              <span>{formatPercent(change)}</span>
            </motion.div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
          <motion.p className="text-3xl font-bold tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
            {display}
          </motion.p>

          {change !== undefined && (
            <p className="text-xs text-text-muted">{changeLabel}</p>
          )}
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
